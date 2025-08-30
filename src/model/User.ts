// src/model/User.ts
import mongoose, { Schema, Document, Types } from "mongoose";
import { Class, classSchema } from "./Class";

export const departments = [
  "ipe",
  "gce",
  "mse",
  "ce",
  "becm",
  "arch",
  "urp",
  "eee",
  "cse",
  "ete",
  "ece",
  "chem",
  "phy",
  "math",
  "hum",
  "bme",
  "mte",
  "che",
] as const;

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  type: "teacher" | "student";
  roll?: string;
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingReviews: boolean;
  classes?: (Types.ObjectId | Class)[];
}

const UserSchema: Schema<User> = new Schema({
  name: { type: String, required: [true, "Name is required"] },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (email: string) {
        const studentEmailRegex = new RegExp(
          `^\\d{7}@student\\.ruet\\.ac\\.bd$`
        ) || "jjohan357@gmail.com";
        if (studentEmailRegex.test(email)) return true;

        const teacherEmailRegex = new RegExp(
          `^.+@(${departments.join("|")})\\.ruet\\.ac\\.bd$`
        ) || "connect.syedasifjohan@gmail.com";
        return teacherEmailRegex.test(email);
      },
      message: "Please use a valid RUET email address",
    },
  },
  type: {
    type: String,
    required: [true, "User type is required"],
    enum: {
      values: ["teacher", "student"],
      message: "Type must be either teacher or student",
    },
  },
  roll: {
    type: String,
    validate: {
      validator: function (this: User, roll: string) {
        if (this.type === "student") {
          return roll && /^\d{7}$/.test(roll);
        }
        return true;
      },
      message: "Roll number must be 7 digits for students",
    },
  },
  isVerified: { type: Boolean, default: false },
  verifyCode: { type: String, required: [true, "Verify code is required"] },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code expiry is required"],
  },
  isAcceptingReviews: { type: Boolean, default: true },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
});

// const UserModel =
//   (mongoose.models.User as mongoose.Model<User>) ||
//   mongoose.model<User>('User', UserSchema);
// const UserModel = mongoose.models.User as mongoose.Model<User>  || mongoose.model<User>('User', UserSchema);
const UserModel =
  mongoose.models?.User as mongoose.Model<User> ||
  mongoose.model<User>('User', UserSchema);
export default UserModel;
