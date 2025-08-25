import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/Types/apiResponse";

export const sendVerificationEmail = async (
  email: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "EchoBoard-Verification Code",
      react: VerificationEmail({ email, otp: verifyCode }),
    });

    return {
      success: true,
      message: "Verification email sent successfully ✅",
    };
  } catch (emailError) {
    console.log("Error sending verification email: ❌", emailError);
    return {
      success: false,
      message: "Error sending verification email",
    };
  }
};
