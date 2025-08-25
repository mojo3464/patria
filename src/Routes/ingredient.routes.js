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
import { multer4server } from "../services/multer.js";

const router = express.Router();

// Admin only routes
router.post(
  "/",
  multer4server().single("image"),
  auth(["admin"]),
  checkRole(["admin", "staff"]),
  createIngredient
);
router.put(
  "/:id",
  multer4server().single("image"),
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
  auth(["admin", "operation", "waiter", "staff", "customer"]),
  checkRole(["admin", "operation", "waiter", "staff", "customer"]),
  getAllIngredients
);
router.get(
  "/category/:category",
  auth(["admin", "operation", "waiter", "staff", "customer"]),
  checkRole(["admin", "operation", "waiter", "staff", "customer"]),
  getIngredientsByCategory
);
router.get(
  "/:id",
  auth(["admin", "operation", "waiter", "staff", "customer"]),
  checkRole(["admin", "operation", "waiter", "staff", "customer"]),
  getIngredientById
);

export default router;
