import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: "dpaio6os9",
  api_key: "687962396355538",
  api_secret: "5NB_dzSSHFMG3zbuGnEWS_KAVws",
});

export default cloudinary;
