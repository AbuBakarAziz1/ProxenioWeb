import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const url = req.nextUrl.pathname;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userRole = token.role; // Extract role from session
  const userStatus = token.status; // Extract user status from session

  // Restrict inactive users to only /user/page.js
  if (url.startsWith("/user") && userStatus === "inactive" && url !== "/user") {
    console.log("Unauthorized! Inactive user trying to access a restricted page");
    return NextResponse.redirect(new URL("/user", req.url));
  }

  // Redirect non-admins from /admin routes
  if (url.startsWith("/admin") && userRole !== "admin") {
    console.log("Unauthorized! Non-admin trying to access /admin");
    return NextResponse.redirect(new URL(`/${userRole}`, req.url));
  }

  // Redirect non-moderators from /moderator routes
  if (url.startsWith("/moderator") && userRole !== "moderator") {
    console.log("Unauthorized! Non-moderator trying to access /moderator");
    return NextResponse.redirect(new URL(`/${userRole}`, req.url));
  }

  // Redirect admins & moderators from /user routes
  if (url.startsWith("/user") && userRole !== "user") {
    console.log("Unauthorized! Admin/Moderator trying to access /user");
    return NextResponse.redirect(new URL(`/${userRole}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/moderator/:path*", "/user/:path*"],
};
