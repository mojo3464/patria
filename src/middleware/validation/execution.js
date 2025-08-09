import { AppError } from "../../utilities/AppError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) return next(new AppError(error.message, 400));

    next();
  };
};
