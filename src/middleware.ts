import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // we need token and current url of user
  const token = await getToken({ req: request });
  const currentUrl = request.nextUrl;
  console.log("token: ", token);

  

  if (token && (
    currentUrl.pathname.startsWith("/sign-in") ||
    currentUrl.pathname.startsWith("/sign-up") ||
    currentUrl.pathname.startsWith("/verify")
  )) {
    return NextResponse.redirect(new URL("/dashboard", request.url));

  }


  if (!token && (
    currentUrl.pathname.startsWith("/dashboard")
  )) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();

}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/dashboard/:path*", "/verify/:path*"],
};
