import { AppError } from "./AppError.js";

export const handlerAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(new AppError(err.message, 400)));
  };
};
