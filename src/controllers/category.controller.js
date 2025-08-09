import categoryModel from "../../DataBase/models/category.model.js";
import productModel from "../../DataBase/models/product.model.js";
import subCategoryModel from "../../DataBase/models/subCategory.model.js";
import { deleteUploadedFile } from "../services/deleteFile.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const createCategory = handlerAsync(async (req, res, next) => {
  const { title } = req.body;

  if (!req.file) return next(new AppError("image is required", 400));
  const categoryExist = await categoryModel.findOne({ title });

  if (categoryExist)
    return next(new AppError("category is already exist", 409));

  const newCategory = await categoryModel.create({
    title,
    createdBy: req.user._id,
    image: req.file.filename,
  });

  res
    .status(201)
    .json({ message: "category creatd successfully", data: newCategory });
});
export const updateCategory = handlerAsync(async (req, res, next) => {
  const { categoryId, title } = req.body;
  if (!req.file) return next(new AppError("image is required", 400));

  const foundedCategory = await categoryModel.findById(categoryId);
  if (!foundedCategory) return next(new AppError("category not exist", 404));
  deleteUploadedFile(foundedCategory.image);
  const updatedCategory = await categoryModel.findByIdAndUpdate(
    categoryId,
    {
      title,
      image: req.file.filename,
    },
    { new: true }
  );
  res.status(200).json({ message: "category updated successfully" });
});
export const deleteCategory = handlerAsync(async (req, res, next) => {
  const { id } = req.params;

  const foundedCategory = await categoryModel.findById(id);

  if (!foundedCategory) return next(new AppError("category not exist", 404));

  deleteUploadedFile(foundedCategory.image);

  await categoryModel.findByIdAndDelete(id);

  res.status(200).json({ message: "category deleted sucessfully" });
});

export const getCategories = handlerAsync(async (req, res, next) => {
  const categories = await categoryModel.find();
  let data = [];
  for (const category of categories) {
    let obj = {
      ...category.toObject(),
    };

    const subCategories = await subCategoryModel.countDocuments({
      category: category._id,
    });
    obj.numsubCategory = subCategories;
    const dishes = await productModel.countDocuments({
      category: category._id,
    });
    obj.products = dishes;
    data.push(obj);
  }

  res.status(200).json({ message: "success", data });
});

export const getCategoryByid = handlerAsync(async (req, res, next) => {
  const categories = await categoryModel.findById(req.params.id);
  if (!categories) return next(new AppError("category not exist", 404));

  res.status(200).json({ message: "success", data: categories });
});
