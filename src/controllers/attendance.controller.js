import attendanceModel from "../../DataBase/models/attendance.model";
import userModel from "../../DataBase/models/user.model.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const handleCheckIn = handlerAsync(async (req, res, next) => {
  const userExits = await userModel.findById(req.user._id);

  if (!userExits) return next(new AppError("user not found", 404));

  const now = new Date();
  const shiftDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [shiftHour, shiftMinute] = userExits.shiftFrom.split(":").map(Number);
  const shiftStartTime = new Date(shiftDate);
  shiftStartTime.setHours(shiftHour, shiftMinute, 0, 0);

  const isLate = now > shiftStartTime;
  const lateBy = isLate
    ? Math.floor((now - shiftStartTime) / 1000 / 60) // difference in minutes
    : 0;

  const alreadyCheckedIn = await attendanceModel.findOne({
    user: req.user._id,
    shiftDate,
  });

  if (alreadyCheckedIn)
    return next(new AppError("user already checked in", 404));

  const data = await attendanceModel.create({
    user: req.user._id,
    checkIn: now,
    shiftDate,
    marked: true,
    isLate,
    lateBy,
  });

  res.status(201).json({
    status: "success",
    data,
  });
});

export const handleCheckOut = handlerAsync(async (req, res, next) => {
  const userExists = await userModel.findById(req.user._id);
  if (!userExists) return next(new AppError("User not found", 404));

  const now = new Date();
  const shiftDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Find today's attendance record
  const attendance = await attendanceModel.findOne({
    user: req.user._id,
    shiftDate,
  });

  if (!attendance) {
    return next(new AppError("No check-in record found for today", 404));
  }

  if (attendance.checkout) {
    return next(new AppError("Already checked out", 400));
  }

  // Calculate worked duration
  const workedMinutes = Math.floor((now - attendance.checkIn) / 1000 / 60);

  attendance.checkout = now;
  attendance.workedMinutes = workedMinutes;

  await attendance.save();

  res.status(200).json({
    status: "success",
    data: attendance,
  });
});
