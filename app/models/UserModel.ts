import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser {
  email: string;
  password: string;
}

export interface IUserDocument extends IUser, mongoose.Document {
  _id: mongoose.Types.ObjectId;
  generateAuthToken(): string;
}

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
  },
  password: { 
    type: String, 
    required: true, 
    minlength: [6, "Password must be at least 6 characters long"],
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error as mongoose.CallbackError);
  }
});

UserSchema.methods.generateAuthToken = function (): string {
  const user = this as IUserDocument;
  const token = jwt.sign(
    { _id: user._id }, 
    process.env.TOKEN_KEY || "defaultSecretKey", 
    { expiresIn: "1h" }
  );
  return token;
};

const User = mongoose.model<IUserDocument>("User", UserSchema);

export default User;