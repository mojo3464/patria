import categoryModel from "../../DataBase/models/category.model.js";
import productModel from "../../DataBase/models/product.model.js";
import subCategoryModel from "../../DataBase/models/subCategory.model.js";
import { deleteUploadedFile } from "../services/deleteFile.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const createSubCategory = handlerAsync(async (req, res, next) => {
  const { title, category } = req.body;

  if (!req.file) return next(new AppError("image is required", 400));
  const subCategoryExist = await subCategoryModel.findOne({ title });

  if (subCategoryExist)
    return next(new AppError("subCategory is already exist", 409));
  const CategoryExist = await categoryModel.findById(category);

  if (!CategoryExist) return next(new AppError("category is not  exist", 409));

  const newSubCategory = await subCategoryModel.create({
    title,
    createdBy: req.user._id,
    image: req.file.filename,
    category,
  });

  res
    .status(201)
    .json({ message: "category creatd successfully", data: newSubCategory });
});

export const updateSubCategory = handlerAsync(async (req, res, next) => {
  const { subCategoryId, title, categoryId } = req.body;
  if (!req.file) return next(new AppError("image is required", 400));

  const foundedSubCategory = await subCategoryModel.findById(subCategoryId);
  if (!foundedSubCategory) return next(new AppError("category not exist", 404));
  deleteUploadedFile(foundedSubCategory.image);
  const updatedSubCategory = await subCategoryModel.findByIdAndUpdate(
    subCategoryId,
    {
      category: categoryId,
      title,
      image: req.file.filename,
    },
    { new: true }
  );
  res.status(200).json({ message: "subCategory updated successfully" });
});

export const deleteSubCategory = handlerAsync(async (req, res, next) => {
  const { id } = req.params;

  const foundedSubCategory = await subCategoryModel.findById(id);

  if (!foundedSubCategory)
    return next(new AppError("subcategory not exist", 404));

  deleteUploadedFile(foundedSubCategory.image);

  await subCategoryModel.findByIdAndDelete(id);

  res.status(200).json({ message: "subcategory deleted sucessfully" });
});

export const getSubCategories = handlerAsync(async (req, res, next) => {
  const Subcategories = await subCategoryModel.find();
  let arr = [];
  for (const subCat of Subcategories) {
    let obj = { ...subCat.toObject() };
    const products = await productModel.countDocuments({
      subCategory: subCat._id,
    });
    obj.products = products;
    arr.push(obj);
  }

  res.status(200).json({ message: "success", data: arr });
});
export const getSubCategoriesbyCategory = handlerAsync(
  async (req, res, next) => {
    const { categoryId } = req.params;
    const Subcategories = await subCategoryModel.find({ category: categoryId });

    res.status(200).json({ message: "success", data: Subcategories });
  }
);
