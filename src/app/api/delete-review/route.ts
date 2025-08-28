// src/app/api/delete-review/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { ReviewModel } from "@/model/Review";
import { ClassModel } from "@/model/Class";
import UserModel from "@/model/User";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user: User = session.user as User;

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const reviewUniqueId = searchParams.get("_id");

    if (!reviewUniqueId) {
      return NextResponse.json(
        { success: false, message: "Review ID is required" },
        { status: 400 }
      );
    }

    // find review
    const review = await ReviewModel.findById(reviewUniqueId);
    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    // find teacher
    const UserTeacher = await UserModel.findById(user._id);

    if (!UserTeacher) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // find class
    const classDoc = await ClassModel.findOne({
      reviewRatings: { $in: [review._id] },
    });

    if (!classDoc) {
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 }
      );
    }

    // find teacher
    const teacher = await UserModel.findOne({
      _id: user._id,
      classes: { $in: [classDoc._id] },
      type: "teacher",
    });

    if (!teacher) {
      return NextResponse.json(
        {
          success: false,
          message: "Teacher not found or not authorized to delete review",
        },
        { status: 404 }
      );
    }

    // remove from class.reviewRatings array
    await ClassModel.findByIdAndUpdate(classDoc._id, {
      $pull: { reviewRatings: reviewUniqueId },
    });

    // delete review
    await ReviewModel.findByIdAndDelete(review._id);

    return NextResponse.json(
      { success: true, message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting review:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while deleting review",
      },
      { status: 500 }
    );
  }
}
