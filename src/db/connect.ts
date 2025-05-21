import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDb = async function () {
  try {
    const response = await mongoose.connect(process.env.MONGODB_URI!);
    console.log("connected DB", response.connection.port);
  } catch (err) {
    console.log("Something went wrong");
  }
};
