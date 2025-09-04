// src/helpers/sendVerificationEmail.ts
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/Types/apiResponse";
import { render } from '@react-email/render'; // Import render function

import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (
  email: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    // Render the React component to a static HTML string


    const transporter = nodemailer.createTransport({
     secure: true,
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user:process.env.NODEMAILER_USER,
        pass:process.env.NODEMAILER_PASSWORD,
      }
    });


// get the html format of email
    const emailHtml = await render(VerificationEmail({ email, otp: verifyCode }));

    transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: "Echoboard - Verify your email",
      text: `Your Verification code: ${verifyCode}`,
      html: emailHtml
    })

    

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