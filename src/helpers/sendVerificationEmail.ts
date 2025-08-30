// src/helpers/sendVerificationEmail.ts
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/Types/apiResponse";
import { render } from '@react-email/render'; // Import render function

export const sendVerificationEmail = async (
  email: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    // Render the React component to a static HTML string
    const emailHtml = render(VerificationEmail({ email, otp: verifyCode }));

    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "EchoBoard-Verification Code",
      react: emailHtml, // Pass the HTML string here
    });

    console.log("Resend email response:", emailResponse);

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