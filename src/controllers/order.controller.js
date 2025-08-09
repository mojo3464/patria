import { customAlphabet } from "nanoid";
import orderMdoel from "../../DataBase/models/order.mdoel.js";
import productModel from "../../DataBase/models/product.model.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";
import tableModel from "../../DataBase/models/Tables.model.js";
import userModel from "../../DataBase/models/user.model.js";

export const createOrder = handlerAsync(async (req, res, next) => {
  const { items, orderType, location, table } = req.body;
  let totalPrice = 0;
  for (const item of items) {
    const product = await productModel.findById({ _id: item.product });
    if (!product) return next(new AppError("product not found", 404));
    let addtionalPrice = 0;
    if (
      item?.customizations &&
      item?.customizations?.extrasWithPrices &&
      item?.customizations?.extrasWithPrices.length
    ) {
      addtionalPrice = item?.customizations?.extrasWithPrices.reduce(
        (acc, curr) => acc + Number(curr.price),
        0
      );
    }
    totalPrice += product.price * item.quantity + addtionalPrice;
  }

  const nanoidNumber = customAlphabet("0123456789", 6);

  if (table) {
    await tableModel.findByIdAndUpdate(table, { status: "Occupied" });
  }
  const randomNumber = nanoidNumber();

  const order = await orderMdoel.create({
    items,
    orderType,
    OrderNumber: randomNumber,
    table: table || null,
    location: location ?? "",
    totalPrice,
    customer: req.user._id,
  });

  res.status(201).json({ message: "order created successfully" });
});
export const updateOrder = handlerAsync(async (req, res, next) => {
  const { id } = req.params;
  const orderExist = await orderMdoel.findById({ _id: id });
  if (!orderExist) next(new AppError("order not found", 404));
  await orderMdoel.findByIdAndUpdate({ _id: id }, req.body);
  res.status(200).json({ message: "order updated successfully" });
});
export const updateOrderStatus = handlerAsync(async (req, res, next) => {
  const { orderId, itemId, status } = req.body;
  const orderExist = await orderMdoel.findById({ _id: orderId });
  if (!orderExist) return next(new AppError("order not found", 404));

  const item = orderExist.items.find((ele) => ele._id.toString() == itemId);

  item.innerStatus = status;
  const updatedOrder = await orderExist.save();

  const items = updatedOrder.items;

  const flag = items.every((ele) => ele.innerStatus == "ready");
  const flag2 = items.every((ele) => ele.innerStatus == "completed");
  const flag3 = items.find((ele) => ele.innerStatus == "preparing");

  if (flag) {
    orderExist.status = "ready";
    await orderExist.save();
  }

  if (flag2) {
    orderExist.status = "completed";
    await orderExist.save();
  }
  if (flag3) {
    orderExist.status = "preparing";
    await orderExist.save();
  }

  res.status(200).json({ message: "order updated successfully" });
});

export const getAllOrders = handlerAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const from = req.query.from;
  const search = req.query.search;

  // Build base query for fromApp and orderType filter
  let query = {};

  if (from === "true" || from === true) {
    // Get only orders from app with delivery type
    query = {
      fromApp: false,
      orderType: "delivery",
    };
  } else if (from === "false" || from === false) {
    // Get only orders from website with dine-in type (note: dine-in with hyphen)
    query = {
      $or: [{ fromApp: false }, { fromApp: { $exists: false } }],
      orderType: "dine-in",
    };
  }
  // If from is not provided, get all orders (no filter applied)

  // If search is provided, find matching customers and tables first
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    // Find matching customers and tables in parallel
    const [matchingCustomers, matchingTables] = await Promise.all([
      // Replace 'Customer' with your actual customer model
      userModel.find({ name: searchRegex }).select("_id").lean(),
      // Replace 'Table' with your actual table model
      tableModel.find({ title: searchRegex }).select("_id").lean(),
    ]);
    const customerIds = matchingCustomers.map((c) => c._id);
    const tableIds = matchingTables.map((t) => t._id);
    // Add search conditions to the main query
    const searchConditions = [{ OrderNumber: searchRegex }];
    if (customerIds.length > 0) {
      searchConditions.push({ customer: { $in: customerIds } });
    }
    if (tableIds.length > 0) {
      searchConditions.push({ table: { $in: tableIds } });
    }

    // Combine with existing query using $and only if there's a filter
    if (Object.keys(query).length > 0) {
      query = {
        $and: [
          query, // existing fromApp and orderType filter
          { $or: searchConditions },
        ],
      };
    } else {
      // If no filter, just use search conditions
      query = { $or: searchConditions };
    }
  }

  // First, get ALL matching orders without pagination to sort them properly
  const [allOrders, totalOrders] = await Promise.all([
    orderMdoel
      .find(query)
      .populate({
        path: "customer",
        select: `name ${
          from === "true" || from === true ? "phone address" : ""
        }`,
      })
      .populate({ path: "items.product", select: "title price" })
      .populate("table", "title")
      .lean(),
    orderMdoel.countDocuments(query),
  ]);

  // Sort ALL orders by status: pending -> preparing -> completed -> ready -> canceled
  allOrders.sort((a, b) => {
    const statusOrder = [
      "pending",
      "preparing",
      "completed",
      "ready",
      "canceled",
    ];
    const aIndex = statusOrder.indexOf(a.status?.toLowerCase());
    const bIndex = statusOrder.indexOf(b.status?.toLowerCase());
    // If status not found, put at end
    const aPos = aIndex === -1 ? 999 : aIndex;
    const bPos = bIndex === -1 ? 999 : bIndex;
    if (aPos !== bPos) {
      return aPos - bPos;
    }
    // If same status, sort by newest first
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // THEN apply pagination to the sorted results
  const orders = allOrders.slice(skip, skip + limit);

  res.status(200).json({
    message: "Orders found successfully",
    data: orders,
    pagination: {
      total: totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit),
    },
  });
});

export const getAllOrdersStats = handlerAsync(async (req, res, next) => {
  const topProductsStats = await orderMdoel.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        value: { $sum: { $ifNull: ["$items.quantity", 1] } },
      },
    },
    { $sort: { value: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products", // Make sure this matches your actual collection name
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $project: {
        productId: "$_id",
        value: 1,
        name: "$productDetails.title",
        // image: "$productDetails.image",
        _id: 0,
      },
    },
  ]);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [
    todayOrderCount,
    countOfCustomer,
    ordersPricing,
    allRodersCount,
    countStaff,
    countOperators,
    countWaiter,
  ] = await Promise.all([
    orderMdoel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }),

    userModel.countDocuments({ role: "customer" }),
    orderMdoel.find().select("totalPrice"),
    orderMdoel.countDocuments(),
    userModel.countDocuments({ role: "staff" }),
    userModel.countDocuments({ role: "operation" }),
    userModel.countDocuments({ role: "waiter" }),
  ]);

  const revenue = ordersPricing.reduce(
    (acc, curr) => acc + curr?.totalPrice,
    0
  );
  res.status(200).json({
    message: "data success",
    data: topProductsStats,
    countOfCustomer,
    todayOrderCount,
    revenue,
    allRodersCount,
    countStaff,
    countOperators,
    countWaiter,
  });
});

const dayMap = {
  1: "Sun", // MongoDB $dayOfWeek: 1 = Sunday
  2: "Mon", // 2 = Monday
  3: "Tue", // 3 = Tuesday
  4: "Wed", // 4 = Wednesday
  5: "Thu", // 5 = Thursday
  6: "Fri", // 6 = Friday
  7: "Sat", // 7 = Saturday
};

const getEgyptDate = () => {
  const now = new Date();
  const egyptTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Africa/Cairo" })
  );
  return egyptTime;
};

export const getWeeklyOrder = handlerAsync(async (req, res, next) => {
  const now = getEgyptDate();
  const day = now.getDay(); // Sunday = 0
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start of week

  const startOfWeek = new Date(now);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Convert to UTC for MongoDB query to avoid timezone issues
  const startOfWeekUTC = new Date(
    startOfWeek.getTime() - startOfWeek.getTimezoneOffset() * 60000
  );
  const endOfWeekUTC = new Date(
    endOfWeek.getTime() - endOfWeek.getTimezoneOffset() * 60000
  );

  const orders = await orderMdoel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfWeekUTC,
          $lte: endOfWeekUTC,
        },
      },
    },
    {
      $addFields: {
        // Convert to Egypt timezone before extracting day
        egyptDate: {
          $dateToString: {
            date: "$createdAt",
            timezone: "Africa/Cairo",
          },
        },
      },
    },
    {
      $addFields: {
        egyptDateObj: {
          $dateFromString: {
            dateString: "$egyptDate",
          },
        },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$egyptDateObj" }, // Now using Egypt timezone
        count: { $sum: 1 },
      },
    },
  ]);

  const dailyOrdersData = [
    { day: "Mon", orders: 0 },
    { day: "Tue", orders: 0 },
    { day: "Wed", orders: 0 },
    { day: "Thu", orders: 0 },
    { day: "Fri", orders: 0 },
    { day: "Sat", orders: 0 },
    { day: "Sun", orders: 0 },
  ];

  orders.forEach(({ _id, count }) => {
    const dayLabel = dayMap[_id];
    const entry = dailyOrdersData.find((d) => d.day === dayLabel);
    if (entry) entry.orders = count;
  });

  res.status(200).json(dailyOrdersData);
});
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const revenueMonthly = handlerAsync(async (req, res, next) => {
  // Generate the last 6 months
  const generateLast6Months = () => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1, // MongoDB months are 1-indexed
        monthName: monthNames[date.getMonth()],
      });
    }
    return months;
  };

  const last6Months = generateLast6Months();

  // Get actual revenue data
  const revenueData = await orderMdoel.aggregate([
    {
      $addFields: {
        egyptDate: {
          $dateToParts: {
            date: "$createdAt",
            timezone: "Africa/Cairo",
          },
        },
      },
    },
    {
      $group: {
        _id: {
          year: "$egyptDate.year",
          month: "$egyptDate.month",
        },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
  ]);

  // Create a map of existing data for quick lookup
  const revenueMap = new Map();
  revenueData.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;
    revenueMap.set(key, {
      revenue: item.revenue,
      orders: item.orders,
    });
  });

  // Merge generated months with actual data
  const result = last6Months.map((monthInfo) => {
    const key = `${monthInfo.year}-${monthInfo.month}`;
    const data = revenueMap.get(key);

    return {
      month: monthInfo.monthName,
      revenue: data ? data.revenue : 0,
      orders: data ? data.orders : 0,
    };
  });

  res.status(200).json(result);
});

export const getOrderBYKitchen = handlerAsync(async (req, res, next) => {
  const { id } = req.params;

  const orders = await orderMdoel
    .find()
    .populate({
      path: "items.product",
      match: { kitchen: id },
    })
    .populate("table")
    .lean();
  const newOrder = orders.map((ele) => {
    const filterd = ele.items.filter((ele) => ele.product);

    return { ...ele, items: filterd };
  });

  const items = newOrder.map((ele) => ele.items);
  const numberofKitchens = new Set(
    items.flat().map((ele) => ele.product.kitchen.toString())
  );
  console.log(numberofKitchens);
  res
    .status(200)
    .json({ message: "order founded successfully", data: newOrder });
});
export const getorderByNumber = handlerAsync(async (req, res, next) => {});
