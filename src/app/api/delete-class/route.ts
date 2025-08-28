// src/app/api/delete-class/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { ClassModel } from "@/model/Class";
import UserModel, {User as MongoUser} from "@/model/User";
import { ReviewModel } from "@/model/Review";


export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
  
  const user: User = session?.user as User;

    if (user.type !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Only teachers can delete classes" },
        { status: 403 }
      );
    }

    await dbConnect();

    // get classUniqueId from url
    const { searchParams } = new URL(req.url);
    const classUniqueId = searchParams.get("_id");
    // url : /api/delete-class?_id=620e5e4a5a9f271f2c0c7b5c

    if (!classUniqueId) {
      return NextResponse.json(
        { success: false, message: "Class ID is required" },
        { status: 400 }
      );
    }

    // check if class exists
    const existingClass = await ClassModel.findById(classUniqueId);
    if (!existingClass) {
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 }
      );
    }

    //find teacher
    const teacher = await UserModel.findOne({classes: classUniqueId });

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }
  
    // check if teacher is the owner of the class
  if (teacher._id!.toString() !== user._id!.toString()) {
    return NextResponse.json(
      { success: false, message: "You are not authorized to delete this class" },
      { status: 403 }
    );
  }

      const reviewIdsToDelete = existingClass.reviewRatings;

  // remove class from teacher's classes array
    await UserModel.findByIdAndUpdate(user._id, {
      $pull: { classes: classUniqueId },
    });

      // Delete all associated reviews
    if (reviewIdsToDelete && reviewIdsToDelete.length > 0) {
      await ReviewModel.deleteMany({ _id: { $in: reviewIdsToDelete } });
    }

    // delete class
    await ClassModel.findByIdAndDelete(classUniqueId);

    return NextResponse.json(
      { success: true, message: "Class deleted successfully" },
      { status: 200 }
    );
} catch (err) {
    console.error("Error deleting class:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error while deleting class" },
      { status: 500 }
    );
  }
}
