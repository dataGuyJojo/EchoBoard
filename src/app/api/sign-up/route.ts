// src/app/api/sign-up/route.ts
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";

import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";
import { departments } from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();
  try {

    const { name, email, password, type } = await req.json();

    if (!name || !email || !password) {
      return Response.json(
        { success: false, error: "Please fill in all the fields" },
        { status: 400 }
      );
    }


    // check validity for student
    const roll = email.split("@")[0];

    if (type === "student" && !email.endsWith("@student.ruet.ac.bd")) {
      return Response.json(
        { success: false, error: "provide the varsity-given student-mail please" },
        { status: 400 }
      );
    }

    // check validity for teacher
    if (type === "teacher" && ((!departments.some((dept) => email.endsWith(`@${dept}.ruet.ac.bd`))) || (email === "connect.syedasifjohan@gmail.com")) ) {
      return Response.json(
        { success: false, error: "provide the varsity-given teacher-mail please" },
        { status: 400 }
      );
    }

    

    const existingUserVerifiedByEmail = await User.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserVerifiedByEmail) {
      return Response.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    const user = await new UserModel({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verifyCode: verifyCode,
      verifyCodeExpiry: expiryDate,
      type: type,
      roll: type === "student" ? roll : undefined, 
      isAcceptingReviews: type === "teacher" ? true : false,
      reviewRatings: []
    }).save();


    if (user) {
      const response = await sendVerificationEmail(email, user.verifyCode);

      if (response.success) {
        return Response.json(
          { success: true, message: "User registered successfully please verify email" },
             { status: 201 });
      } else {
        return Response.json({
          success: false,
          error: "Error sending verification email form sign-up route",
        }, { status: 500 });
      }
    }
  } catch (error) {
    console.log("Error creating user: ❌", error);
    return Response.json(
      { success: false, error: "Error creating user 🔴" },
      { status: 500 }
    );
  }
}
