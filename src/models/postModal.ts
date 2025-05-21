import mongoose, { Model, Schema } from "mongoose";

export interface IPost extends Document {
  title: string;
  like: number;
  disLike: number;
  comments: {
    title: string;
    userId: Schema.Types.ObjectId;
  }[];
}

export interface IPostModal extends Model<IPost> {}

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    like: {
      type: Number,
      default: 0,
    },
    disLike: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        title: String,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: "Post",
  }
);

export const Post = mongoose.model<IPost, IPostModal>("Post", postSchema);
