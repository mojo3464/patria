import customProductModel from "../../DataBase/models/customProduct.model.js";
import ingredientModel from "../../DataBase/models/ingredient.model.js";
import orderMdoel from "../../DataBase/models/order.mdoel.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";

// Create custom product
export const createCustomProduct = handlerAsync(async (req, res, next) => {
  const { name, ingredients, description } = req.body;

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return next(new AppError("Ingredients must be a non-empty array", 400));
  }

  let totalPrice = 0;
  const validatedIngredients = [];

  for (const item of ingredients) {
    const ingredient = await ingredientModel.findById(item.ingredient);
    if (!ingredient) {
      return next(
        new AppError(`Ingredient with ID ${item.ingredient} not found`, 404)
      );
    }
    if (!ingredient.available) {
      return next(
        new AppError(`Ingredient ${ingredient.name} is not available`, 400)
      );
    }

    // Calculate price for this ingredient
    const itemPrice = ingredient.price * (item.quantity || 1);
    totalPrice += itemPrice;
    validatedIngredients.push({
      ingredient: item.ingredient,
      quantity: item.quantity || 1,
    });
  }

  try {
    const customProduct = await customProductModel.create({
      name,
      ingredients: validatedIngredients,
      description,
      kitchen: "6893b58c2eeda45fea7ccf66",
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      createdBy: req.user?._id,
    });

    await customProduct.populate({
      path: "ingredients.ingredient",
      select: "name price category",
    });

    res.status(201).json({
      message: "Custom product created successfully",
      data: customProduct,
    });
  } catch (error) {
    return next(
      new AppError("Failed to create custom product: " + error.message, 500)
    );
  }
});

export const getUserCustomProducts = handlerAsync(async (req, res, next) => {
  const customProducts = await customProductModel
    .find({ createdBy: req.user._id, isActive: true })
    .populate({
      path: "ingredients.ingredient",
      select: "name price",
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "Custom products retrieved successfully",
    result: customProducts.length,
    data: customProducts,
  });
});

// Get custom product by ID
export const getCustomProductById = handlerAsync(async (req, res, next) => {
  const { id } = req.params;

  const customProduct = await customProductModel
    .findById(id)
    .populate({
      path: "ingredients.ingredient",
      select: "name price category description image",
    })
    .populate("createdBy", "name");

  if (!customProduct) {
    return next(new AppError("Custom product not found", 404));
  }

  res.status(200).json({
    message: "Custom product retrieved successfully",
    data: customProduct,
  });
});

// Update custom product
export const updateCustomProduct = handlerAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, ingredients, description } = req.body;

  // Check if custom product exists and belongs to user
  const existingProduct = await customProductModel.findById(id);
  if (!existingProduct) {
    return next(new AppError("Custom product not found", 404));
  }

  if (existingProduct.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new AppError("Not authorized to update this custom product", 403)
    );
  }

  // Validate ingredients if provided
  if (ingredients) {
    for (const item of ingredients) {
      const ingredient = await ingredientModel.findById(item.ingredient);
      if (!ingredient) {
        return next(
          new AppError(`Ingredient with ID ${item.ingredient} not found`, 404)
        );
      }
      if (!ingredient.available) {
        return next(
          new AppError(`Ingredient ${ingredient.name} is not available`, 400)
        );
      }
    }
  }

  const customProduct = await customProductModel
    .findByIdAndUpdate(
      id,
      {
        name,
        ingredients,
        description,
      },
      { new: true, runValidators: true }
    )
    .populate({
      path: "ingredients.ingredient",
      select: "name price category",
    });

  res.status(200).json({
    message: "Custom product updated successfully",
    data: customProduct,
  });
});

export const deleteCustomProduct = handlerAsync(async (req, res, next) => {
  const { id } = req.params;

  const customProduct = await customProductModel.findByIdAndDelete(id);
  if (!customProduct) {
    return next(new AppError("Custom product not found", 404));
  }

  if (customProduct.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new AppError("Not authorized to delete this custom product", 403)
    );
  }

  res.status(200).json({
    message: "Custom product deleted successfully",
  });
});

// Calculate custom product price
export const calculateCustomProductPrice = handlerAsync(
  async (req, res, next) => {
    const {
      ingredients,
      createOrder,
      orderType = "delivery",
      location,
      quantity = 1,
    } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return next(new AppError("Ingredients are required", 400));
    }

    let totalPrice = 0;
    const ingredientDetails = [];

    for (const item of ingredients) {
      const ingredient = await ingredientModel.findById(item.ingredient);
      if (!ingredient) {
        return next(
          new AppError(`Ingredient with ID ${item.ingredient} not found`, 404)
        );
      }
      if (!ingredient.available) {
        return next(
          new AppError(`Ingredient ${ingredient.name} is not available`, 400)
        );
      }

      const itemPrice = ingredient.price * item.quantity;
      totalPrice += itemPrice;

      ingredientDetails.push({
        ingredient: {
          _id: ingredient._id,
          name: ingredient.name,
          price: ingredient.price,
          category: ingredient.category,
        },
        quantity: item.quantity,
        itemPrice,
      });
    }

    // If createOrder is true, create a custom product and order it
    if (createOrder) {
      try {
        // Create a temporary custom product name
        const customProductName = `Custom Order - ${new Date().toLocaleString()}`;

        // Create the custom product
        const customProduct = await customProductModel.create({
          name: customProductName,
          ingredients,
          description: "Custom order created from price calculation",
          createdBy: req.user._id,
        });

        // Create the order
        const { customAlphabet } = await import("nanoid");
        const nanoidNumber = customAlphabet("0123456789", 6);
        const randomNumber = nanoidNumber();

        const order = await orderMdoel.create({
          items: [
            {
              productType: "custom",
              customProduct: customProduct._id,
              quantity: quantity,
              notes: "Order created from price calculation",
            },
          ],
          orderType: orderType,
          OrderNumber: randomNumber,
          location: location || "",
          totalPrice: parseFloat((totalPrice * quantity).toFixed(2)),
          customer: req.user._id,
          fromApp: true,
        });

        return res.status(201).json({
          message: "Custom product ordered successfully",
          data: {
            order: {
              _id: order._id,
              OrderNumber: order.OrderNumber,
              totalPrice: order.totalPrice,
              orderType: order.orderType,
              status: order.status,
            },
            customProduct: {
              _id: customProduct._id,
              name: customProduct.name,
              totalPrice: customProduct.totalPrice,
            },
            calculatedPrice: totalPrice,
            quantity: quantity,
          },
        });
      } catch (error) {
        return next(
          new AppError("Failed to create order: " + error.message, 500)
        );
      }
    }

    // Return just the price calculation
    res.status(200).json({
      message: "Price calculated successfully",
      data: {
        totalPrice,
        ingredients: ingredientDetails,
      },
    });
  }
);

// Create order from multiple custom products
export const createOrderFromIngredients = handlerAsync(
  async (req, res, next) => {
    const { customProducts, orderType = "delivery", location } = req.body;

    if (!Array.isArray(customProducts) || customProducts.length === 0) {
      return next(
        new AppError(
          "Custom products array is required and must not be empty",
          400
        )
      );
    }

    try {
      let totalPrice = 0;
      const orderItems = [];
      const customProductDetails = [];

      // Process each custom product
      for (const item of customProducts) {
        const { customProductId, quantity = 1 } = item;

        if (!customProductId) {
          return next(
            new AppError("Custom product ID is required for each item", 400)
          );
        }

        // Find the existing custom product
        const customProduct = await customProductModel
          .findById(customProductId)
          .populate({
            path: "ingredients.ingredient",
            select: "name price category",
          });

        if (!customProduct) {
          return next(
            new AppError(
              `Custom product with ID ${customProductId} not found`,
              404
            )
          );
        }

        // Check if the custom product belongs to the user
        if (customProduct.createdBy.toString() !== req.user._id.toString()) {
          return next(
            new AppError(
              `Not authorized to order custom product: ${customProduct.name}`,
              403
            )
          );
        }

        // Check if the custom product is active
        if (!customProduct.isActive) {
          return next(
            new AppError(
              `Custom product "${customProduct.name}" is no longer available`,
              400
            )
          );
        }

        // Calculate price for this item
        const itemPrice = customProduct.totalPrice * quantity;
        totalPrice += itemPrice;

        // Add to order items
        orderItems.push({
          productType: "custom",
          customProduct: customProduct._id,
          quantity: quantity,
        });

        // Add to custom product details for response
        customProductDetails.push({
          _id: customProduct._id,
          name: customProduct.name,
          totalPrice: customProduct.totalPrice,
          ingredients: customProduct.ingredients,
          quantity: quantity,
          itemPrice: itemPrice,
        });
      }

      // Create the order
      const { customAlphabet } = await import("nanoid");
      const nanoidNumber = customAlphabet("0123456789", 6);
      const randomNumber = nanoidNumber();

      const order = await orderMdoel.create({
        items: orderItems,
        orderType: orderType,
        OrderNumber: randomNumber,
        location: location || "",
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        customer: req.user._id,
      });

      // Populate the order for response
      await order.populate({
        path: "items.customProduct",
        select: "name totalPrice ingredients",
      });

      res.status(201).json({
        message: "Order created successfully from custom products",
      });
    } catch (error) {
      return next(
        new AppError("Failed to create order: " + error.message, 500)
      );
    }
  }
);
