// src/app/api/verify-code/route.ts 
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
    await dbConnect();
  try {
    const { email, code } = await req.json();
// decode email as you are getting it from the url
    const emailDecoded = decodeURIComponent(email);
    const user = await UserModel.findOne({ email: emailDecoded});
    
    if (!user) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
        user.isVerified = true;
        await user.save();
        return Response.json(
            { success: true, message: "Email verified successfully" },
            { status: 200 }
        );
    } else if (!isCodeNotExpired) {
      return Response.json(
        { success: false, error: "Verification code has expired" },
        { status: 400 }
      );
    }   else {
      return Response.json(
        { success: false, error: "Invalid verification code" },
        { status: 400 }
      );
    }



  } catch (error) {
    console.error("Error verifying email:", error);
    return Response.json(
      { success: false, error: "Error verifying email" },
      { status: 500 }
    );
  }
}
