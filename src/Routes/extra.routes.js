import express from "express";
const router = express.Router();

import {
  createExtra,
  updateExtra,
  deleteExtra,
  getAllExtras,
} from "../controllers/extra.controller.js";

import { auth } from "../middleware/auth/auth.js";
import { checkRole } from "../middleware/auth/roleAuth.js";

router.get(
  "/:productId/extras",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  getAllExtras
);

router.post(
  "/:productId/extras",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  createExtra
);

router.put(
  "/:productId/extras/:extraId",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  updateExtra
);

router.delete(
  "/:productId/extras/:extraId",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  deleteExtra
);

export default router;
