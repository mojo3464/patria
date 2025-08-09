import express from "express";
import { multer4server } from "../services/multer.js";
import {
  createTable,
  getTables,
  updateTable,
} from "../controllers/tables.controller.js";
import { auth } from "../middleware/auth/auth.js";
import { checkRole } from "../middleware/auth/roleAuth.js";

import { validate } from "../middleware/validation/execution.js";
import { updateTableSchema } from "../middleware/validation/schema.js";

const tablesRoutes = express.Router();

tablesRoutes.post(
  "/",
  multer4server().single("image"),
  auth(["admin", "operation", "waiter"]),
  checkRole(["admin", "operation", "waiter"]),
  createTable
);
tablesRoutes.get("/", auth(["admin", "operation", "waiter"]), checkRole(["admin", "operation", "waiter"]), getTables);
tablesRoutes.put(
  "/:id",
  auth(["admin", "operation", "waiter"]),
  checkRole(["admin", "operation", "waiter"]),
  validate(updateTableSchema),
  updateTable
);

export default tablesRoutes;
