import express from "express";
import {
  createOrder,
  getAllOrders,
  getAllOrdersStats,
  getOrderBYKitchen,
  getWeeklyOrder,
  revenueMonthly,
  updateOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import { validate } from "../middleware/validation/execution.js";
import { createOrderSchema } from "../middleware/validation/schema.js";
import { auth } from "../middleware/auth/auth.js";
import { checkRole } from "../middleware/auth/roleAuth.js";

const orderRoutes = express.Router();

orderRoutes.post(
  "/",
  auth(["admin", "operation", "waiter", "customer"]),
  checkRole(["admin", "operation", "waiter", "customer"]),
  validate(createOrderSchema),
  createOrder
);
orderRoutes.put(
  "/:id",
  auth(["admin", "operation", "waiter"]),
  checkRole(["admin", "operation", "waiter"]),
  updateOrder
);
orderRoutes.patch(
  "/",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  updateOrderStatus
);
orderRoutes.get(
  "/getbykitchen/:id",
  auth(["admin", "staff", "operation"]),
  checkRole(["admin", "staff", "operation"]),
  getOrderBYKitchen
);
orderRoutes.get(
  "/",
  // auth(["admin", "operation", "waiter"]),
  // checkRole(["admin", "operation", "waiter"]),
  getAllOrders
);
orderRoutes.get(
  "/stats",

  getAllOrdersStats
);
orderRoutes.get(
  "/weekly",

  getWeeklyOrder
);
orderRoutes.get(
  "/revenue/monthly",

  revenueMonthly
);

export default orderRoutes;
