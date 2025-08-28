// src/app/api/get-classes/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userID = new mongoose.Types.ObjectId(user._id);

  try {
    // ✅ fetch user and populate classes
    const dbUser = await UserModel.findById(userID)
      .populate("classes") // bring in actual Class documents
      .exec();
    
    if (!dbUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!dbUser.classes) {
      return Response.json(
        { success: false, message: "No classes found" },
        { status: 404 }
      );
    }

    // ✅ sort by createdAt (now available from populated Class docs)
    const sortedClasses = dbUser.classes.sort(
      (a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    return Response.json(
      { success: true, classes: sortedClasses },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting classes: ", error);
    return Response.json(
      { success: false, message: "Error getting classes" },
      { status: 500 }
    );
  }
}
