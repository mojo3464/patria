import User from "../../DataBase/models/user.model.js";
import Product from "../../DataBase/models/product.model.js";
import { handlerAsync } from "../utilities/handleAsync.js";
import { AppError } from "../utilities/AppError.js";

export const addProductToWishlist = handlerAsync(async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found in database", 404));
  }

  const user = await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { wishlist: productId },
  });
  res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishlist",
    data: user.wishlist,
  });
});

export const removeProductFromWishlist = handlerAsync(
  async (req, res, next) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("Product not found in database", 404));
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: productId },
      },
      { new: true }
    );

    res.status(400).json({
      status: "succes",
      message: "Product removed successfuly from your wishlist",
      data: user.wishlist,
    });
  }
);

export const getLoggedUserWishlist = handlerAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "success",
    message: "Get All Product successfully from your wishlist",
    result: user.wishlist.length,
    data: user.wishlist,
  });
});
