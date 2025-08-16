import offerModel from "../../DataBase/models/product.model.js";
import productModel from "../../DataBase/models/offer.model.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const createOffer = handlerAsync(async (req, res, next) => {
  const { title, description, items, priceAfterDiscount } = req.body;

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
    image: req.file.filename,
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

  res.status(200).json({
    message: "offers retreived successfully",
    result: offer.length,
    data: offer,
  });
});

export const deactiveOffer = handlerAsync(async (req, res, next) => {
  const offerId = req.params.offerId;
  const offer = await offerModel.findByIdAndUpdate(
    offerId,
    { isActive: false },
    { new: true }
  );
  if (!offer) {
    return next(new AppError("Offer not found", 404));
  }

  res.status(200).json({ message: "Offer deleted successfully" });
});

export const activeOffer = handlerAsync(async (req, res, next) => {
  const offerId = req.params.offerId;
  const offer = await offerModel.findByIdAndUpdate(
    offerId,
    { isActive: true },
    { new: true }
  );
  if (!offer) {
    return next(new AppError("Offer not found", 404));
  }

  res.status(200).json({ message: "Offer deleted successfully" });
});

export const updateOffer = handlerAsync(async (req, res, next) => {
  const offerId = req.params.offerId;
  if (!req.file) return next(new AppError("image is required", 400));

  const offer = await offerModel.findByIdAndUpdate(
    offerId,
    { ...req.body, image: req.file.filename },
    {
      new: true,
    }
  );
  if (!offer) {
    return next(new AppError("Offer not found", 404));
  }

  res.status(201).json({ message: "offer updated successfully" });
});
