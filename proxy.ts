import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/sign-in", "/sign-up"];
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api");

  // Private routes that require authentication
  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  // Skip authentication check for API routes to avoid infinite loop
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  try {
    // Check if user is authenticated by checking cookies directly
    const cookieHeader = request.headers.get("cookie") || "";
    const hasSessionCookie =
      cookieHeader.includes("token=") || cookieHeader.includes("refreshToken=");

    // For development, we'll be less strict and allow access
    const isAuthenticated = hasSessionCookie;

    // If trying to access private route without authentication, redirect to sign-in
    if (isPrivateRoute && !isAuthenticated) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // If authenticated user trying to access public routes, redirect to profile
    if (isAuthenticated && !isPublicRoute && !isPrivateRoute) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If there's an error checking session, assume not authenticated
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }
}
