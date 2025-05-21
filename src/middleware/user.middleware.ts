import { NextFunction, Request, Response } from "express";
import { asyncHandlers } from "../utils/asyncHandlers";
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/userModal";

declare global {
  namespace Express {
    interface Request {}
  }
}

export interface AuthRequest extends Request {
  user?: IUser;
}

const findUser = asyncHandlers(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    console.log("🚀 ~ accessToken:", req.cookies);

    const decodeToken = (await jwt.verify(
      accessToken,
      process.env.JWT_SECRET!
    )) as {
      _id: string;
    };
    const { _id } = decodeToken;

    if (!_id) {
      throw Error("Id not found");
    }

    const user = await User.findById(_id);

    if (!user) {
      throw Error("Id not found");
    }

    req.user = user;

    next();
  }
);

export { findUser };
