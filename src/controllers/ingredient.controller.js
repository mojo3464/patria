import ingredientModel from "../../DataBase/models/ingredient.model.js";
import { deleteUploadedFile } from "../services/deleteFile.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const createIngredient = handlerAsync(async (req, res, next) => {
  const { name, price, category, description } = req.body;

  const ingredient = await ingredientModel.create({
    name,
    price,
    description,
    image: req.file.filename,
    category,
    createdBy: req.user._id,
  });

  res.status(201).json({
    message: "Ingredient created successfully",
    data: ingredient,
  });
});

// Get all ingredients
export const getAllIngredients = handlerAsync(async (req, res, next) => {
  const { category, available, search } = req.query;

  let query = {};

  if (category) {
    query.category = category;
  }

  if (available !== undefined) {
    query.available = available === "true";
  }

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const ingredients = await ingredientModel
    .find(query)
    .populate("createdBy", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "Ingredients retrieved successfully",
    result: ingredients.length,
    data: ingredients,
  });
});

// Get ingredient by ID
export const getIngredientById = handlerAsync(async (req, res, next) => {
  const { id } = req.params;

  const ingredient = await ingredientModel
    .findById(id)
    .populate("createdBy", "name");

  if (!ingredient) {
    return next(new AppError("Ingredient not found", 404));
  }

  res.status(200).json({
    message: "Ingredient retrieved successfully",
    data: ingredient,
  });
});

// Update ingredient
export const updateIngredient = handlerAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, description, category } = req.body;

  const foundedIngredient = await ingredientModel.findById(id);
  if (!foundedIngredient) {
    return next(new AppError("Ingredient not found", 404));
  }

  let image = foundedIngredient.image;

  if (req.file && req.file.filename) {
    deleteUploadedFile(foundedIngredient.image);
    image = req.file.filename;
  }

  const ingredient = await ingredientModel.findByIdAndUpdate(
    id,
    {
      name,
      price,
      description,
      category,
      image: image,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: "Ingredient updated successfully",
    data: ingredient,
  });
});

// Delete ingredient
export const deleteIngredient = handlerAsync(async (req, res, next) => {
  const { id } = req.params;

  const ingredient = await ingredientModel.findByIdAndDelete(id);
  if (!ingredient) {
    return next(new AppError("Ingredient not found", 404));
  }

  deleteUploadedFile(ingredient.image);

  res.status(200).json({
    message: "Ingredient deleted successfully",
  });
});

// Get ingredients by category
export const getIngredientsByCategory = handlerAsync(async (req, res, next) => {
  const { category } = req.params;

  const ingredients = await ingredientModel
    .find({ category, available: true })
    .sort({ name: 1 });

  res.status(200).json({
    message: "Ingredients retrieved successfully",
    data: ingredients,
  });
});
