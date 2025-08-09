import mongoose from "mongoose";

const kitchenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
  },
});

const kitchenModel = mongoose.model("kitchen", kitchenSchema);

export default kitchenModel;
