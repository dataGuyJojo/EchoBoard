// src/app/api/get-reviews/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { ClassModel } from "@/model/Class";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  // example url: api/get-reviews?_id=620e5e4a5a9f271f2c0c7b5c
  const { searchParams } = new URL(request.url);
  const classUniqueID = searchParams.get("_id");

  if (!classUniqueID) {
    return Response.json(
      { success: false, message: "classCode query param is required" },
      { status: 400 }
    );
  }

  try {
    const classData = await ClassModel.findById(classUniqueID)
      .populate("reviewRatings")
      .exec();
    
    if (!classData || classData.reviewRatings.length === 0) {
      return Response.json(
        { success: false, message: "No reviews found for this class" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, reviews: classData.reviewRatings },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting class reviews: ", error);
    return Response.json(
      { success: false, message: "Error getting class reviews" },
      { status: 500 }
    );
  }
}
