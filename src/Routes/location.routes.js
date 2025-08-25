import express from "express";
const router = express.Router();

import {
  createLocation,
  updateLocation,
  deleteLocation,
  getAllLocation,
  getLocation,
} from "../controllers/location.controller.js";

import { auth } from "../middleware/auth/auth.js";
import { checkRole } from "../middleware/auth/roleAuth.js";

router.get(
  "/",
  auth(["admin", "operation", "waiter", "customer", "staff"]),
  checkRole(["admin", "operation", "waiter", "customer", "staff"]),
  getAllLocation
);

router.post(
  "/",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  createLocation
);

router.put(
  "/:id",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  updateLocation
);

router.get(
  "/:id",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  getLocation
);

router.delete(
  "/:id",
  auth(["admin", "operation", "waiter", "staff"]),
  checkRole(["admin", "operation", "waiter", "staff"]),
  deleteLocation
);

export default router;
