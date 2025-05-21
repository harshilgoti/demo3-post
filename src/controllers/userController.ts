import { NextFunction, Request, Response } from "express";
import { asyncHandlers } from "../utils/asyncHandlers";
import { User } from "../models/userModal";
import AppResponse from "../utils/AppResponse";
import mongoose from "mongoose";

const generateToken = async (id: mongoose.Types.ObjectId) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateAccessToken();

  user.refreshToken = refreshToken;
  return { accessToken, refreshToken };
};
const register = asyncHandlers(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, fullname } = req.body;

    if ([email, password, fullname].some((f) => f?.trim() === "")) {
      throw new Error("All field are required");
    }

    const user = await User.findOne({ email });

    if (user) {
      throw new Error("User already exist");
    }

    const createdUser = await User.create({
      email,
      password,
      fullname,
    });

    const loggedUser = await User.findById(createdUser._id).select("-password");

    return res
      .status(200)
      .json(new AppResponse(200, loggedUser, "User created successfully"));
  }
);

const login = asyncHandlers(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if ([email, password].some((f) => f?.trim() === "")) {
      throw new Error("All field are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const isPassCorrect = await user.isPasswordCorrect(password);
    if (!isPassCorrect) {
      throw new Error("Invalid credential");
    }

    const { accessToken, refreshToken } = await generateToken(user._id);

    const loggedUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60),
        secure: true,
        httpOnly: true,
        sameSite: "none" as const,
      })
      .cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60),
        secure: true,
        httpOnly: true,
        sameSite: "none" as const,
      })
      .json(new AppResponse(200, loggedUser, "User created successfully"));
  }
);

export { login, register };
