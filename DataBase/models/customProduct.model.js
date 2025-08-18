import mongoose from "mongoose";

const customProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    kitchen: {
      type: mongoose.Types.ObjectId,
      ref: "kitchen",
    },
    ingredients: [
      {
        ingredient: {
          type: mongoose.Types.ObjectId,
          ref: "Ingredient",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Calculate total price before saving (only if not already set)
customProductSchema.pre("save", async function (next) {
  try {
    // Only calculate if totalPrice is not already set or is 0
    if (
      (!this.totalPrice || this.totalPrice === 0) &&
      this.ingredients &&
      this.ingredients.length > 0
    ) {
      const Ingredient = mongoose.model("Ingredient");
      let total = 0;

      for (const item of this.ingredients) {
        const ingredient = await Ingredient.findById(item.ingredient);
        if (ingredient) {
          total += ingredient.price * (item.quantity || 1);
        }
      }

      this.totalPrice = total;
    }
  } catch (error) {
    console.error("Error calculating total price:", error);
    // Don't fail the save operation, just set to 0
    this.totalPrice = 0;
  }
  next();
});

export default mongoose.model("CustomProduct", customProductSchema);
