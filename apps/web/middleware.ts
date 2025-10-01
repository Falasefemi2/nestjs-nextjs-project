/** @format */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRedirectUrlForUser } from "./lib/roleRouting";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    const userCookie = request.cookies.get("auth-storage");

    if (userCookie) {
      try {
        const authData = JSON.parse(userCookie.value);
        if (authData.state?.user && authData.state?.isAuthenticated) {
          const redirectUrl = getRedirectUrlForUser(authData.state.user);
          return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
      } catch (error) {
        console.error("Error parsing auth cookie:", error);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
