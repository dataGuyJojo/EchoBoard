import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { User } from "next-auth"; // Import the User type from next-auth not the one we created

export async function POST(request: Request) {
  await dbConnect();

  // get session and then get the user from the session that you injected
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userID = user._id;
  const { acceptingReviews } = await request.json();

  try {
    const UpdatedUser = await UserModel.findByIdAndUpdate(
      userID,
      { isAcceptingReviews: acceptingReviews },
      { new: true }
    );

    if (UpdatedUser) {
      return Response.json(
        {
          success: true,
          message: "Reviews accepted status updated successfully",
          UpdatedUser,
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        { success: false, message: "Failed to update accept reviews" },
        { status: 404 }
      );
    }
    ;
  } catch (error) {
    console.log("Error accepting reviews: ", error);

    return Response.json(
      { success: false, message: "Error accepting reviews" },
      { status: 500 }
    );
  }
}

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
  const userID = user._id;

  try {
    const foundUser = await UserModel.findById(userID);

    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, isAcceptingReviews: foundUser.isAcceptingReviews },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error getting accept reviews: ", error);

    return Response.json(
      { success: false, message: "Error getting accept reviews" },
      { status: 500 }
    );
  }
}

