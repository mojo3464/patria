import express from "express";
import { auth } from "../middleware/auth/auth.js";
import { checkRole } from "../middleware/auth/roleAuth.js";
import {
  handleCheckIn,
  handleCheckOut,
} from "../controllers/attendance.controller.js";

const attendanceRoutes = express.Router();

attendanceRoutes.post(
  "/checkin",
  auth(["admin", "staff", "operation", "waiter"]),
  checkRole(["admin", "staff", "operation", "waiter"]),
  handleCheckIn
);
attendanceRoutes.post(
  "/checkout",
  auth(["admin", "staff", "operation", "waiter"]),
  checkRole(["admin", "staff", "operation", "waiter"]),
  handleCheckOut
);

export default attendanceRoutes;
