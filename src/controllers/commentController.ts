import { application, NextFunction, Request, Response } from "express";
import { asyncHandlers } from "../utils/asyncHandlers";
import { AuthRequest } from "../middleware/user.middleware";
import { IUser } from "../models/userModal";
import { Comments } from "../models/commentModal";
import mongoose from "mongoose";
import AppResponse from "../utils/AppResponse";

const getComments = asyncHandlers(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const comments = await Comments.find().populate("postId userId");

      if (!comments) {
        throw Error("comment not created");
      }

      return res
        .status(201)
        .json(new AppResponse(200, comments, "Comment fetch successfully"));
    } catch (err) {
      throw Error("Something went wrong");
    }
  }
);

const createComment = asyncHandlers(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const { title } = req.body;
      const { _id } = req.user as IUser;

      if (!postId) {
        throw Error("Post id not found");
      }

      if (!_id) {
        throw Error("Post id not found");
      }

      const comment = await Comments.create({
        title,
        postId: new mongoose.Types.ObjectId(postId),
        userId: _id,
      });

      if (!comment) {
        throw Error("comment not created");
      }

      return res
        .status(201)
        .json(new AppResponse(201, comment, "Comment created successfully"));
    } catch (err) {
      throw Error("Something went wrong");
    }
  }
);

export { createComment, getComments };
