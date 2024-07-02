// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export { default } from "next-auth/middleware";

// // Middleware function to handle authentication and redirection
// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request });
//   const url = request.nextUrl;

//   // Redirect authenticated users from specific paths to the dashboard
//   if (
//     token &&
//     (url.pathname.startsWith("/sign-in") ||
//       url.pathname.startsWith("/sign-up") ||
//       url.pathname.startsWith("/verify") ||
//       url.pathname.startsWith("/"))
//   ) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // Redirect unauthenticated users from protected paths to the home page
//   if (!token) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }
//   // Redirect unauthenticated users from protected paths to the home page
//   if (!token) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Allow authenticated users to access other paths
//   return NextResponse.next();
// }

// new
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

// config matcher to redirect unauthenticated users to the sign-in page and authenticated users to the dashboard
// config used for on which paths need to run middleware
export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/", "/verify/:path*"],
};

export async function middleware(request: NextRequest) {
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

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
