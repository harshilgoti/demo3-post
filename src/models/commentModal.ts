import mongoose, { Model, Schema } from "mongoose";

export interface IComment extends Document {
  title: string;
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

export interface ICommentModal extends Model<IComment> {}

const commentSchema = new mongoose.Schema<IComment>({
  title: String,
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Comments = mongoose.model<IComment, ICommentModal>(
  "Comment",
  commentSchema
);
