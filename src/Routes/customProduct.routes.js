import express from "express";
import {
  createCustomProduct,
  getUserCustomProducts,
  getCustomProductById,
  updateCustomProduct,
  deleteCustomProduct,
  createOrderFromIngredients,
} from "../controllers/customProduct.controller.js";
import { auth } from "../middleware/auth/auth.js";

const router = express.Router();

router.use(auth(["admin", "operation", "waiter", "staff", "customer"]));

router.post("/", createCustomProduct);
router.get("/", getUserCustomProducts);
router.get("/:id", getCustomProductById);
router.put("/:id", updateCustomProduct);
router.delete("/:id", deleteCustomProduct);

router.post("/orderFromIngredients", createOrderFromIngredients);

export default router;
