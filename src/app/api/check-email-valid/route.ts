import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import z from "zod";
import {
  studentEmailValidation,
  teacherEmailValidation,
} from "@/schemas/signupSchema";

// unified schema for either student or teacher email
const checkEmailValidSchema = z.object({
  email: z
    .string()
    .refine(
      (val) =>
        studentEmailValidation.safeParse(val).success ||
        teacherEmailValidation.safeParse(val).success,
      {
        message: "Email must be a valid RUET student or teacher email",
      }
    ),
});

export async function GET(request: Request) {
  
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const emailFromQuery = {
      email: searchParams.get("email"),
    };

    // validate with zod
    const result = checkEmailValidSchema.safeParse(emailFromQuery);

    if (!result.success) {
      const emailError = result.error.format().email?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            emailError[0] || "Email must be a valid RUET student or teacher email",
        },
        { status: 400 }
      );
    }

    const { email } = result.data;

    const VerifiedUser = await UserModel.findOne({ email, isVerified: true });

    if (VerifiedUser) {
      return Response.json(
        { success: false, message: "Email already verified" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Valid RUET email", email },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking email validity:", error);
    return Response.json(
      { success: false, message: "Error checking email validity" },
      { status: 500 }
    );
  }
}
