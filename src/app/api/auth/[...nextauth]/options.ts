import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

// sign in page is here
export const authOptions: NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Password",
                },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                   const user = await UserModel.findOne({
                        email: credentials.email,
                    });

                    if (!user) {
                        throw new Error("User not found");
                    }
                    if (!user.isVerified) {
                        throw new Error("User is not verified");
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (isPasswordValid) {
                        return user;
                    } else {
                        throw new Error("Invalid password");
                    }



                } catch (error: any) {
                    throw new Error(error);
                }
                
            }

        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.name = user.name;
                token.type = user.type;
                token.email = user.email;
                token.isVerified = user.isVerified;
                token.isAcceptingReviews = user.isAcceptingReviews;
            }
            // log token
            // console.log("JWT token from callback: ", token);
            return token;
        },
        async session({ session, token }) {
           if (token) {
            session.user._id = token._id;
            session.user.name = token.name;
            session.user.type = token.type;
            session.user.email = token.email;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingReviews = token.isAcceptingReviews;
            
           }
            return session;
        },


    },
    pages: {
        signIn: "/auth/signin",

    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    

} 