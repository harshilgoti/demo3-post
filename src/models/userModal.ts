import mongoose, { Document, Model, Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullname: string;
  email: string;
  password: string;
  avatar?: string;
  refreshToken?: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
}

export interface IUserModal extends Model<IUser> {}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "User",
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return await jwt.sign({ _id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};
userSchema.methods.generateRefreshToken = async function (password: string) {
  return await jwt.sign({ _id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: "3d",
  });
};
export const User = mongoose.model<IUser, IUserModal>("User", userSchema);
