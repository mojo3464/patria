import express from "express";
import {
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
  getIngredientsByCategory,
} from "../controllers/ingredient.controller.js";
import { auth } from "../middleware/auth/auth.js";
import { checkRole } from "../middleware/auth/roleAuth.js";

const router = express.Router();

// Admin only routes
router.post(
  "/",
  auth(["admin"]),
  checkRole(["admin", "staff"]),
  createIngredient
);
router.put(
  "/:id",
  auth(["admin"]),
  checkRole(["admin", "staff"]),
  updateIngredient
);
router.delete(
  "/:id",
  auth(["admin"]),
  checkRole(["admin", "staff"]),
  deleteIngredient
);

router.get(
  "/",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  getAllIngredients
);
router.get(
  "/category/:category",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  getIngredientsByCategory
);
router.get(
  "/:id",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  getIngredientById
);

export default router;
