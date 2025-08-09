import Joi from "joi";
import mongoose from "mongoose";

const phoneRegex = /^01[0125][0-9]{8}$/;

// ################# user #################
export const registerSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(30),
  phone: Joi.string().pattern(phoneRegex).required(),
  role: Joi.string().required().valid("customer", "staff", "admin"),
  permissions: Joi.array().items(Joi.string()),
});
export const staffValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(40).messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must not exceed 40 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().min(6).messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),

  age: Joi.number().integer().min(15).max(90).required().messages({
    "number.base": "Age must be a number",
    "number.integer": "Age must be a whole number",
    "number.min": "Age must be at least 15",
    "number.max": "Age must not exceed 90",
    "any.required": "Age is required",
  }),

  salary: Joi.number().positive().required().messages({
    "number.base": "Salary must be a number",
    "number.positive": "Salary must be positive",
    "any.required": "Salary is required",
  }),

  phone: Joi.string()
    .required()
    .pattern(/^[0-9+\-\s()]+$/)
    .messages({
      "string.empty": "Phone is required",
      "string.pattern.base": "Invalid phone number",
      "any.required": "Phone is required",
    }),

  shiftFrom: Joi.string().required().messages({
    "string.empty": "Shift start time is required",
    "any.required": "Shift start time is required",
  }),

  shiftTo: Joi.string().required().messages({
    "string.empty": "Shift end time is required",
    "any.required": "Shift end time is required",
  }),

  role: Joi.string().valid("staff", "operation", "waiter").required().messages({
    "string.empty": "Role is required",
    "any.only": "Invalid role selected",
    "any.required": "Role is required",
  }),

  access: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "At least one access level must be selected",
    "any.required": "Access permissions are required",
  }),
});
export const updatestaffValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(40).messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must not exceed 40 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),

  age: Joi.number().integer().min(15).max(90).required().messages({
    "number.base": "Age must be a number",
    "number.integer": "Age must be a whole number",
    "number.min": "Age must be at least 15",
    "number.max": "Age must not exceed 90",
    "any.required": "Age is required",
  }),

  salary: Joi.number().positive().required().messages({
    "number.base": "Salary must be a number",
    "number.positive": "Salary must be positive",
    "any.required": "Salary is required",
  }),

  phone: Joi.string()
    .required()
    .pattern(/^[0-9+\-\s()]+$/)
    .messages({
      "string.empty": "Phone is required",
      "string.pattern.base": "Invalid phone number",
      "any.required": "Phone is required",
    }),

  shiftFrom: Joi.string().required().messages({
    "string.empty": "Shift start time is required",
    "any.required": "Shift start time is required",
  }),

  shiftTo: Joi.string().required().messages({
    "string.empty": "Shift end time is required",
    "any.required": "Shift end time is required",
  }),

  role: Joi.string().valid("staff", "operation", "waiter").required().messages({
    "string.empty": "Role is required",
    "any.only": "Invalid role selected",
    "any.required": "Role is required",
  }),

  access: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "At least one access level must be selected",
    "any.required": "Access permissions are required",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(30),
});
export const updateUserSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required().min(3).max(30),
  phone: Joi.string().pattern(phoneRegex, "invalid").required(),
});

// ################# category #################

export const categorySchema = Joi.object({
  title: Joi.string().required().min(4).max(50),
});
export const updateCategorySchema = Joi.object({
  title: Joi.string().required().min(4).max(50),
  categoryId: Joi.string()
    .custom((value, helpers) => {
      // Check if the categoryId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Category ID must be a valid ObjectId");
      }
      return value;
    })
    .required(),
});

// ################# subCategory #################

export const createSubCategorySchema = Joi.object({
  title: Joi.string().required().min(4).max(50),
  category: Joi.string()
    .custom((value, helpers) => {
      // Check if the categoryId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Category ID must be a valid ObjectId");
      }
      return value;
    })
    .required(),
});

export const updateSubCategorySchema = Joi.object({
  title: Joi.string().required().min(4).max(50),
  categoryId: Joi.string()
    .custom((value, helpers) => {
      // Check if the categoryId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Category ID must be a valid ObjectId");
      }
      return value;
    })
    .required(),
  subCategoryId: Joi.string()
    .custom((value, helpers) => {
      // Check if the categoryId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("subCategory ID must be a valid ObjectId");
      }
      return value;
    })
    .required(),
});

//////orders/////

export const createOrderSchema = Joi.object({
  orderType: Joi.string().required().valid("dine-in", "takeaway", "delivery"),
  fromApp:Joi.boolean().optional(),
  location: Joi.string().optional().allow(""),
  tableNumber: Joi.string().optional().allow(""),
  table: Joi.string().optional(),
  specialInstructions: Joi.string(),
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string()
          .custom((value, helpers) => {
            // Check if the categoryId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(value)) {
              return helpers.message("product ID must be a valid ObjectId");
            }
            return value;
          })
          .required(),

        quantity: Joi.number().required().min(1),
        notes: Joi.string().optional().allow(""),
        customizations: Joi.object(),
      })
    )
    .min(1)
    .required(), // 👈 requires at least one item
});

export const updateTableSchema = Joi.object({
  status: Joi.string().valid("Available", "Occupied", "Reserved"),
});
