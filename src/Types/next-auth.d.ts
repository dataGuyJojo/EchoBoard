import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    type?: string;
    isVerified?: boolean;
    isAcceptingReviews?: boolean;
    name?: string;
  }

  interface Session {
    user: {
      _id?: string;
      type?: string;
      isVerified?: boolean;
      isAcceptingReviews?: boolean;
      name?: string;
    } & DefaultSession['user'];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    type?: string;
    isVerified?: boolean;
    isAcceptingReviews?: boolean;
    name?: string;
  }
}
