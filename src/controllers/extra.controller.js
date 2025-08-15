import { AppError } from "../utilities/AppError.js";
import productModel from "../../DataBase/models/product.model.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const createExtra = handlerAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { title, price } = req.body;

  if (!title || !price) {
    return next(new AppError("Title and price are required", 400));
  }

  const product = await productModel.findByIdAndUpdate(
    productId,
    {
      $push: {
        extras: { name: title, price },
      },
    },
    { new: true }
  );

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(201).json({
    status: "success",
    message: "Extra created successfully",
    productId,
    data: product.extras[product.extras.length - 1],
  });
});

export const updateExtra = handlerAsync(async (req, res, next) => {
  const { productId, extraId } = req.params;
  const { title, price } = req.body;

  if (!title && !price) {
    return next(new AppError("Title or price are required", 400));
  }
  const product = await productModel.findOneAndUpdate(
    { _id: productId, "extras._id": extraId },
    {
      $set: {
        "extras.$.name": title,
        "extras.$.price": price,
      },
    },
    { new: true }
  );

  if (!product) {
    return next(new AppError("Product or extra not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Extra updated successfully",
    productId,
    data: product.extras.find((extra) => extra._id.toString() === extraId),
  });
});

export const deleteExtra = handlerAsync(async (req, res, next) => {
  const { productId, extraId } = req.params;

  const product = await productModel.findOneAndUpdate(
    { _id: productId, "extras._id": extraId },
    {
      $pull: {
        extras: { _id: extraId },
      },
    },
    { new: true }
  );

  if (!product) {
    return next(new AppError("Product or extra not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Extra deleted successfully",
    productId,
    data: product.extras,
  });
});

export const getAllExtras = handlerAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await productModel.findById(productId).select("extras");

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Extras retrieved successfully",
    productId,
    result: product.extras.length,
    data: product.extras,
  });
});
