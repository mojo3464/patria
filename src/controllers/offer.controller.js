import offerModel from "../../DataBase/models/offer.model";
import productModel from "../../DataBase/models/product.model";
import { AppError } from "../utilities/AppError";
import { handlerAsync } from "../utilities/handleAsync";

export const createOffer = handlerAsync(async (req, res, next) => {
  const { title, image, description, items, priceAfterDiscount } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError("At least one product is required", 400));
  }

  const existingProducts = await productModel.find({ _id: { $in: items } });

  if (existingProducts.length != items.length) {
    return next(
      new AppError("One or more product do not exist in the product collection")
    );
  }

  const offer = await offerModel.create({
    title,
    image,
    description,
    items,
    priceAfterDiscount,
  });

  if (!offer) {
    return next(new AppError("Failed to create offer", 400));
  }
  res.status(201).json({ message: "offer created successfully", data: offer });
});

export const getAllOffer = handlerAsync(async (req, res, next) => {
  const offer = await offerModel.find().populate("items", "title image price");

  if (!offer || offer.length === 0) {
    return next(new AppError("No offer exist"));
  }

  res
    .status(200)
    .json({
      message: "offers retreived successfully",
      result: offer.length,
      data: offer,
    });
});
