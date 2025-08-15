import express from "express";
const router = express.Router();
import {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} from "../controllers/wishlist.controller.js";
import { auth } from "../middleware/auth/auth.js";
import { checkRole } from "../middleware/auth/roleAuth.js";

router.post(
  "/",
  auth(["admin", "operation", "waiter", "customer"]),
  checkRole(["admin", "operation", "waiter", "customer"]),
  addProductToWishlist
);
router.delete(
  "/:productId",
  auth(["admin", "operation", "waiter", "customer"]),
  checkRole(["admin", "operation", "waiter", "customer"]),
  removeProductFromWishlist
);
router.get(
  "/",
  auth(["admin", "operation", "waiter", "customer"]),
  checkRole(["admin", "operation", "waiter", "customer"]),
  getLoggedUserWishlist
);

export default router;
