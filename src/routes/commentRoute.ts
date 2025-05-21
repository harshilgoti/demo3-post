import express from "express";
import { createComment, getComments } from "../controllers/commentController";
import { findUser } from "../middleware/user.middleware";

const commentRoute = express.Router();

commentRoute.route("/create/:postId").post(findUser, createComment);
commentRoute.route("/").get(getComments);

export default commentRoute;
