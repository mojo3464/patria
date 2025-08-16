import express from "express";
const router = express.Router();

import {
  createOffer,
  getAllOffer,
  updateOffer,
  activeOffer,
  deactiveOffer,
} from "../controllers/offer.controller.js";

import { auth } from "../middleware/auth/auth.js";
import { checkRole } from "../middleware/auth/roleAuth.js";

router.get(
  "/",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  getAllOffer
);

router.post(
  "/",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  createOffer
);

router.put(
  "/:id",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  updateOffer
);

router.patch(
  "/active",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  activeOffer
);
router.patch(
  "/deActive",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  deactiveOffer
);

export default router;
