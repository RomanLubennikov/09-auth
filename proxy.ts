import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/sign-in", "/sign-up"];
  const isPublicAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";
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
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    let isAuthenticated = !!accessToken;

    // If accessToken is missing but refreshToken exists, try to refresh session
    if (!accessToken && refreshToken) {
      try {
        const response = await checkSession();
        if (response.data) {
          isAuthenticated = true;
        }
      } catch {
        isAuthenticated = false;
      }
    }

    // If trying to access private route without authentication, redirect to sign-in
    if (isPrivateRoute && !isAuthenticated) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // If authenticated user trying to access auth routes, redirect to home
    if (isAuthenticated && isPublicAuthRoute) {
      return NextResponse.redirect(new URL("/", request.url));
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
