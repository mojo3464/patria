import express from "express";
import {
  delet_staff,
  handle_add_staff,
  handle_update_staff,
  handlegetAllStaff,
  handlegetUser,
  handleLogin,
  handleRegister,
  handleUpdateUser,
  contactUs,
} from "../controllers/user.controller.js";
import { validate } from "../middleware/validation/execution.js";
import {
  loginSchema,
  registerSchema,
  staffValidationSchema,
  updatestaffValidationSchema,
  updateUserSchema,
} from "../middleware/validation/schema.js";
import { auth } from "../middleware/auth/auth.js";
import { checkRole } from "../middleware/auth/roleAuth.js";
import { multer4server } from "../services/multer.js";

const userRoutes = express.Router();

userRoutes.post("/register", validate(registerSchema), handleRegister);
userRoutes.get("/getuser/:id", handlegetUser);
userRoutes.post(
  "/addStaff",
  auth(["admin"]),
  checkRole(["admin"]),
  validate(staffValidationSchema),
  handle_add_staff
);
userRoutes.put(
  "/updateStaff/:id",
  auth(["admin"]),
  checkRole(["admin"]),
  validate(updatestaffValidationSchema),
  handle_update_staff
);
userRoutes.post("/login", validate(loginSchema), handleLogin);
userRoutes.put(
  "/update",
  multer4server().single("image"),
  auth(["customer", "staff", "admin"]),
  validate(updateUserSchema),

  handleUpdateUser
);
userRoutes.get(
  "/staff",
  auth(["admin", "operation"]),
  checkRole(["admin", "operation"]),
  handlegetAllStaff
);
userRoutes.delete(
  "/staff/:id",
  auth(["admin"]),
  checkRole(["admin"]),
  delet_staff
);

userRoutes.post(
  "/contactUs",
  auth(["admin", "customer"]),
  checkRole(["admin", "customer"]),
  contactUs
);
export default userRoutes;
