import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: [
        true,
        "An ingredient with this title already exists. Please choose another one.",
      ],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ["protein", "vegetable", "sauce", "cheese", "bread", "other"],
        message:
          "Category must be one of: protein, vegetable, sauce, cheese, bread, or other",
      },
    },
    description: {
      type: String,
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ingredient", ingredientSchema);
