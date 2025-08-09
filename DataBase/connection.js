import mongoose from "mongoose";

export default async function connection() {
  await mongoose
    .connect(process.env.DATABASEONLINE)
    .then((res) => console.log("connection established"))
    .catch((err) => console.log("connection err"));
}
