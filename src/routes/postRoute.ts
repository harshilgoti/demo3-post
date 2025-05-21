import express from "express";
import {
  commentPost,
  createPost,
  disLikePost,
  likePost,
  postList,
} from "../controllers/postController";
import { findUser } from "../middleware/user.middleware";

const postRoute = express.Router();

postRoute.route("/").get(postList);
postRoute.route("/create").post(createPost);
postRoute.route("/like/:id").post(likePost);
postRoute.route("/dislike/:id").post(disLikePost);
postRoute.route("/comment/:id").post(findUser, commentPost);

export default postRoute;
