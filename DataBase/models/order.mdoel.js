import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // or 'Product' if it's a generic store
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        notes: {
          type: String,
          default: "",
        },
        customizations: {
          extras: [{ type: String }],
          removals: [{ type: String }],
          extrasWithPrices: [
            {
              id: String,
              name: String,
              price: String,
            },
          ],
        },
        specialInstructions: String,
        innerStatus: {
          type: String,
          enum: ["pending", "preparing", "ready", "completed", "cancelled"],
          default: "pending",
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table", // or 'Product' if it's a generic store
    },
    orderType: {
      type: String,
      enum: ["dine-in", "takeaway", "delivery"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    OrderNumber: {
      type: String,
    },
    location: {
      type: String,
    },
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Employee", // if staff create orders
    // },
    fromApp: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
