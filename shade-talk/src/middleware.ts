import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Authorization for admin panel only
  // if (
  //   token &&
  //   url.pathname.startsWith("/adminPanel") &&
  //   token.role !== "admin"
  // ) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // Redirect to sign-in if the user is not authenticated
  if (
    !token &&
    (url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/me") ||
      url.pathname.startsWith("/profile") ||
      url.pathname.startsWith("/adminPanel"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
