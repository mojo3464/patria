import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
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
  subCategory: {
    type: mongoose.Types.ObjectId,
    ref: "subCategory",
    required: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  ingredients: [{ type: String }],
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  kitchen: {
    type: mongoose.Types.ObjectId,
    ref: "kitchen",
    required: true,
  },
  extras: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        min: 0,
        required: true,
      },
    },
  ],
});

productSchema.pre(/^find/, function (next) {
  // Ensure we always include a custom field container
  if (!this._mongooseOptions) this._mongooseOptions = {};
  this._mongooseOptions.isFavouriteFor = this.getOptions().isFavouriteFor;
  next();
});

// After documents are fetched
productSchema.post(/^find/, async function (docs) {
  if (!this._mongooseOptions || !this._mongooseOptions.isFavouriteFor) return;

  const userId = this._mongooseOptions.isFavouriteFor;
  const User = mongoose.model("User");

  // Get wishlist of that user
  const user = await User.findById(userId).select("wishlist");
  if (!user) return;

  const wishlistSet = new Set(user.wishlist.map((id) => id.toString()));

  // Add virtual is_favourite for each product
  docs.forEach((doc) => {
    doc._doc.is_favourite = wishlistSet.has(doc._id.toString());
  });
});

const productModel = mongoose.model("Product", productSchema);

export default productModel;
