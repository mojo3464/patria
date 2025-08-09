import express from "express";

import { auth } from "../middleware/auth/auth.js";
import { checkRole } from "../middleware/auth/roleAuth.js";
import { multer4server } from "../services/multer.js";
import { validate } from "../middleware/validation/execution.js";
import {
  createSubCategorySchema,
  updateSubCategorySchema,
} from "../middleware/validation/schema.js";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  updateSubCategory,
  getSubCategoriesbyCategory,
} from "../controllers/subCategory.controller.js";

const subCategoryRoutes = express.Router();

subCategoryRoutes.post(
  "/",
  multer4server().single("image"),
  validate(createSubCategorySchema),
  auth(["admin", "operation"]),
  checkRole(["admin", "operation"]),
  createSubCategory
);
subCategoryRoutes.put(
  "/",
  multer4server().single("image"),
  auth(["admin", "operation"]),
  checkRole(["admin", "operation"]),
  validate(updateSubCategorySchema),
  updateSubCategory
);
subCategoryRoutes.delete(
  "/:id",
  auth(["admin", "operation"]),
  checkRole(["admin", "operation"]),
  deleteSubCategory
);
subCategoryRoutes.get(
  "/",
  auth(["admin", "operation", "waiter", "customer"]),
  checkRole(["admin", "operation", "waiter", "customer"]),
  getSubCategories
);
subCategoryRoutes.get(
  "/category/:categoryId",
  auth(["admin", "operation", "waiter", "customer"]),
  checkRole(["admin", "operation", "waiter", "customer"]),
  getSubCategoriesbyCategory
);
export default subCategoryRoutes;
