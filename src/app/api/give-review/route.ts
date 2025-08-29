// src/app/api/give-review/route.ts
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { ReviewModel } from "@/model/Review";
import { ClassModel } from "@/model/Class";
import { Types } from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  const { _id: classUniqueId, reviewRatings} = await request.json();

  // Find the class
  const classDoc = await ClassModel.findById(classUniqueId).populate("reviewRatings");

  if (!classDoc) {
    return Response.json(
      { success: false, message: "Class not found" },
      { status: 404 }
    );
  }

  // Find the teacher who owns this class
  const teacher = await UserModel.findOne({ classes: classUniqueId });

  if (!teacher) {
    return Response.json(
      { success: false, message: "teacher with such class not found" },
      { status: 404 }
    );
  }

  if (!teacher.isAcceptingReviews) {
    return Response.json(
      { success: false, message: "teacher is not accepting reviews" },
      { status: 400 }
    );
  }

  // Create a new review document
  const newReview = await ReviewModel.create({
    ...reviewRatings,
    createdAt: new Date(),
  });

  // Push into the class' reviewRatings array
  classDoc.reviewRatings.push(newReview._id as Types.ObjectId);
  await classDoc.save();

  return Response.json(
    { success: true, message: "Review added successfully" },
    { status: 200 }
  );
}