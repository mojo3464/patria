import tableModel from "../../DataBase/models/Tables.model.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const createTable = handlerAsync(async (req, res, next) => {
  const { title } = req.body;

  const tableExist = await tableModel.findOne({ title });

  if (tableExist) return next(new AppError("table already exist", 400));

  await tableModel.create({
    title,
    createdBy: req.user._id,
    image: req.file.filename,
  });

  res.status(201).json({ message: "table created successfully" });
});

export const getTables = handlerAsync(async (req, res, next) => {
  const data = await tableModel.find();

  res.status(200).json({ message: "table founded successfully", data });
});
export const updateTable = handlerAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const tableExits = await tableModel.findById(id);
  if (!tableExits) return next("table not found", 404);

  tableExits.status = status;
  await tableExits.save();

  res.status(200).json({ message: "table updated successfully" });
});
