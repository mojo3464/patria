import express from "express";
const router = express.Router();

import {
  createOffer,
  getAllOffer,
  getOffer,
  updateOffer,
  activeOffer,
  deactiveOffer,
} from "../controllers/offer.controller.js";

import { auth } from "../middleware/auth/auth.js";
import { checkRole } from "../middleware/auth/roleAuth.js";
import { multer4server } from "../services/multer.js";

router.get(
  "/",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  getAllOffer
);

router.post(
  "/",
  multer4server().single("image"),
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  createOffer
);

router.get(
  "/:offerId",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  getOffer
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
