// src/app/api/create-class/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { ClassModel } from "@/model/Class"; // adjust path if needed
import UserModel from "@/model/User";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

   

    const body = await req.json();
    const { classCode, className, series, section } = body;

    if (!classCode || !className || !series || !section) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // check if user is a teacher
    const user: User = session.user as User;
    if (user.type !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Only teachers can create classes" },
        { status: 403 }
      );
    }

    // create class
    const newClass = await ClassModel.create({
      classCode,
      className,
      series,
      section,
      createdAt: new Date(),
    });

    // link class to teacher
    await UserModel.findByIdAndUpdate(user._id, {
      $push: { classes: newClass._id },
    });

    return NextResponse.json(
      { success: true, class: newClass },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating class:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error while creating class" },
      { status: 500 }
    );
  }
}
