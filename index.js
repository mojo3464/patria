import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import connection from "./DataBase/connection.js";
import { AppError } from "./src/utilities/AppError.js";
import userRoutes from "./src/Routes/user.routes.js";

import categoryRoutes from "./src/Routes/category.routes.js";
import subCategoryRoutes from "./src/Routes/subCategory.routes.js";
import proudctRoutes from "./src/Routes/product.routes.js";
import kitchenRotes from "./src/Routes/kitchen.routes.js";
import orderRoutes from "./src/Routes/order.routes.js";
import tablesRoutes from "./src/Routes/tables.routes.js";
import extraRoutes from "./src/Routes/extra.routes.js";
import wishlistRoutes from "./src/Routes/wishlist.routes.js";

connection();
const app = express();
app.use(cors());
app.use(express.json());

// Make 'uploads' folder publicly accessible
app.use("/uploads", express.static("uploads"));

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/subcategory", subCategoryRoutes);
app.use("/api/v1/product", proudctRoutes);
app.use("/api/v1/kitchen", kitchenRotes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/tables", tablesRoutes);
app.use("/api/v1/products", extraRoutes);
app.use("/api/v1/wishlists", wishlistRoutes);

// handle foriegn routes

app.all("*", (req, res, next) => {
  next(new AppError(`invalid url ${req.originalUrl}`, 404));
});

//global handle error
app.use((err, req, res, next) => {
  if (err)
    return res
      .status(err.statusCode || 400)
      .json({ message: err.message, stack: err.stack });
});

const myport = process.env.PORT || 5000;
app.listen(myport, () => {
  console.log(`server on port ${myport} `);
});
