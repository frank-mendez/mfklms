import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define role-based access rules
const roleBasedRoutes = {
  // Routes that require SUPERADMIN access
  SUPERADMIN: [
    '/users',
    '/activities',
  ],
  // Routes that require ADMIN or SUPERADMIN access  
  ADMIN: [
    '/owners',
    '/stashes',
  ],
  // Routes that all authenticated users can access
  USER: [
    '/dashboard',
    '/borrowers',
    '/loans', 
    '/repayments',
    '/transactions',
  ],
};

// Helper function to check if user has access to a route
function hasRouteAccess(userRole: string | undefined, pathname: string): boolean {
  if (!userRole) return false;

  // SUPERADMIN can access everything
  if (userRole === 'SUPERADMIN') return true;
  
  // Check if route requires SUPERADMIN
  if (roleBasedRoutes.SUPERADMIN.some(route => pathname.startsWith(route))) {
    return userRole === 'SUPERADMIN';
  }
  
  // Check if route requires ADMIN or SUPERADMIN
  if (roleBasedRoutes.ADMIN.some(route => pathname.startsWith(route))) {
    return userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  }
  
  // Check if route is accessible to all users
  if (roleBasedRoutes.USER.some(route => pathname.startsWith(route))) {
    return true; // All authenticated users can access
  }
  
  // Default deny for unlisted routes
  return false;
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect root to dashboard
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // If no token, redirect to sign in (handled by withAuth)
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Check role-based access for protected routes
    const userRole = token.role as string | undefined;
    
    // Skip role check for API routes (they handle their own auth)
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    // Check if user has access to this route
    if (!hasRouteAccess(userRole, pathname)) {
      // Redirect to dashboard with access denied message
      const url = new URL('/dashboard', req.url);
      url.searchParams.set('error', 'access-denied');
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
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
