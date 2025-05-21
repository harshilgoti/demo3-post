import { NextFunction, Request, Response } from "express";
import { asyncHandlers } from "../utils/asyncHandlers";
import { Post } from "../models/postModal";
import AppResponse from "../utils/AppResponse";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/user.middleware";

const postList = asyncHandlers(
  async (req: Request, res: Response, next: NextFunction) => {
    // const posts = await Post.find().populate("comments.userId");
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
          pipeline: [
            {
              $lookup: {
                from: "User",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $addFields: {
                user: { $first: "$user" },
              },
            },
          ],
        },
      },
    ]);

    if (!posts) {
      throw Error("Post not found");
    }

    return res
      .status(200)
      .json(new AppResponse(200, posts, "Post fetch successfully!!"));
  }
);

const createPost = asyncHandlers(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;

    const post = await Post.create({ title });

    if (!post) {
      throw Error("Post not created");
    }

    return res
      .status(201)
      .json(new AppResponse(201, post, "Post create successfully!!"));
  }
);

const likePost = asyncHandlers(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      throw Error("Id not found");
    }

    const post = await Post.findById(id);

    if (!post) {
      throw Error("Post not found");
    }

    await Post.findByIdAndUpdate(id, {
      like: post.like + 1,
    });

    const updatedPost = await Post.findById(post._id);

    return res
      .status(201)
      .json(
        new AppResponse(201, updatedPost, "Post like update successfully!!")
      );
  }
);

const disLikePost = asyncHandlers(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      throw Error("Id not found");
    }

    const post = await Post.findById(id);

    if (!post) {
      throw Error("Post not found");
    }

    await Post.findByIdAndUpdate(id, {
      like: post.like - 1,
    });

    const updatedPost = await Post.findById(post._id);

    return res
      .status(201)
      .json(
        new AppResponse(201, updatedPost, "Post like update successfully!!")
      );
  }
);

const commentPost = asyncHandlers(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title } = req.body;
    const { _id } = req?.user ?? {};

    if (!_id) {
      throw Error("Id not found");
    }

    const comment = {
      title,
      userId: new mongoose.Types.ObjectId(_id),
    };

    const post = await Post.findByIdAndUpdate(
      id,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      }
    );

    if (!comment) {
      throw Error("Comment not added");
    }

    return res
      .status(201)
      .json(new AppResponse(201, post, "Comment create successfully!!"));
  }
);

export { postList, createPost, likePost, disLikePost, commentPost };
