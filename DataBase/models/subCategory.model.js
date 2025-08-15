import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
  },
});

subCategorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "subCategory",
});
subCategorySchema.set("toObject", { virtuals: true });
subCategorySchema.set("toJSON", { virtuals: true });

const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

export default subCategoryModel;
