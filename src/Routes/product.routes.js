import express from "express";

import { auth } from "../middleware/auth/auth.js";
import { checkRole } from "../middleware/auth/roleAuth.js";
import { multer4server } from "../services/multer.js";
import {
  addProduct,
  getProducts,
  getProductsbyId,
  getProductsbySub,
  updateProduct,
  getProductbestSaller
} from "../controllers/product.controller.js";

const proudctRoutes = express.Router();

proudctRoutes.post(
  "/",
  multer4server().single("image"),
  auth(["admin", "operation"]),
  checkRole(["admin", "operation"]),
  addProduct
);
proudctRoutes.put(
  "/:id",
  multer4server().single("image"),
  auth(["admin", "operation"]),
  checkRole(["admin", "operation"]),
  updateProduct
);

proudctRoutes.get(
  "/",
  auth(["admin", "operation", "waiter", "customer"]),
  checkRole(["admin", "operation", "waiter", "customer"]),
  getProducts
);
proudctRoutes.get(
  "/best/saller/prodcut",
  auth(["admin", "operation", "waiter", "customer"]),
  checkRole(["admin", "operation", "waiter", "customer"]),
  getProductbestSaller
);

proudctRoutes.get(
  "/bysubcat/:id",
  auth(["admin", "operation", "waiter", "customer"]),
  checkRole(["admin", "operation", "waiter", "customer"]),
  getProductsbySub
);
proudctRoutes.get(
  "/:id",
  auth(["admin", "operation", "waiter", "customer"]),
  checkRole(["admin", "operation", "waiter", "customer"]),
  getProductsbyId
);

export default proudctRoutes;
