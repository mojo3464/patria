import kitchenModel from "../../DataBase/models/kitchen.model.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const add_kitchen = handlerAsync(async (req, res, next) => {
  const { name } = req.body;

  await kitchenModel.create({
    name,
    image: req.file.filename,
    createdBy: req.user._id,
  });

  res.status(201).json({ message: "kitchen added successfully" });
});
export const get_kitchens = handlerAsync(async (req, res, next) => {
  const data = await kitchenModel.find();

  res.status(201).json({ message: "kitchen added successfully", data });
});
