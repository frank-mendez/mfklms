import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Configure which routes to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - auth (sign in, sign up)
     * - api/auth (NextAuth.js endpoints)
     * - public assets (favicon, images)
     * - _next (Next.js internals)
     */
    "/((?!auth|api/auth|_next|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico)$).*)",
  ],
};
