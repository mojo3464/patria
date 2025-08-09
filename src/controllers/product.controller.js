import categoryModel from "../../DataBase/models/category.model.js";
import orderMdoel from "../../DataBase/models/order.mdoel.js";
import productModel from "../../DataBase/models/product.model.js";
import subCategoryModel from "../../DataBase/models/subCategory.model.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const addProduct = handlerAsync(async (req, res, next) => {
  const {
    title,
    category,
    subCategory,
    kitchen,
    price,
    ingredients,

    description,
  } = req.body;

  console.log(req.body);

  const categoryExist = await categoryModel.findById({ _id: category });
  if (!categoryExist) return next(new AppError("category is not exist", 404));
  const subcategoryExist = await subCategoryModel.findById(subCategory);
  if (!subcategoryExist)
    return next(new AppError("subcategory is not exist", 404));

  const newproduct = await productModel.create({
    title,
    createdBy: req.user._id,
    image: req.file.filename,
    category,
    subCategory,
    price,
    ingredients,
    image: req.file.filename,
    description,
    kitchen,
  });

  res.status(201).json({ message: "product created sucessfully" });
});

export const updateProduct = handlerAsync(async (req, res, next) => {
  const { id } = req.params;
  const foundedProduct = await productModel.findById({ _id: id });

  if (!foundedProduct) return next(new AppError("product not found", 404));

  await productModel.findByIdAndUpdate({ _id: id }, req.body);

  res.status(200).json({ message: "product updated successfully" });
});

export const getProducts = handlerAsync(async (req, res, next) => {
  const products = await productModel
    .find()
    .populate("kitchen")
    .populate("category")
    .populate("subCategory");
  res
    .status(200)
    .json({ message: "product founded sucessfully", data: products });
});
export const getProductsbyId = handlerAsync(async (req, res, next) => {
  const { id } = req.params;
  const products = await productModel
    .findById(id)
    .populate("kitchen")
    .populate("category")
    .populate("subCategory");
  res
    .status(200)
    .json({ message: "product founded sucessfully", data: products });
});
export const getProductsbySub = handlerAsync(async (req, res, next) => {
  const { id } = req.params;
  const products = await productModel
    .find({ subCategory: id })
    .populate("kitchen");

  res
    .status(200)
    .json({ message: "product founded sucessfully", data: products });
});
export const getProductbestSaller = handlerAsync(async (req, res, next) => {
  const topProductStats = await orderMdoel.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        value: { $sum: { $ifNull: ["$items.quantity", 1] } },
      },
    },
    { $sort: { value: -1 } },
    { $limit: 1 }, // Changed from 5 to 1 to get only the top seller
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

  // Since we're getting only one product, you might want to return it as a single object
  let bestSeller = topProductStats[0] || null;

  if (bestSeller) {
    const productDetails = await productModel
      .findById(bestSeller.productId)
      .populate("category")
      .populate("subCategory");

    bestSeller.product = productDetails;
  }

  res.status(200).json({
    message: "Best selling product found successfully",
    data: bestSeller,
  });
});
