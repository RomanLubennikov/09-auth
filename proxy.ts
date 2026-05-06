import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public auth routes
  const isPublicAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";

  // Private routes that require authentication
  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  // Skip authentication check for API routes and static assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    let isAuthenticated = !!accessToken;
    let sessionRefreshed = false;
    const response = NextResponse.next();

    // If accessToken is missing but refreshToken exists, try to refresh session
    if (!accessToken && refreshToken) {
      try {
        const sessionResponse = await checkSession();
        if (sessionResponse.data) {
          isAuthenticated = true;
          sessionRefreshed = true;

          // Update cookies with new tokens from session response
          const setCookieHeader = sessionResponse.headers["set-cookie"];
          if (setCookieHeader) {
            const cookieArray = Array.isArray(setCookieHeader)
              ? setCookieHeader
              : [setCookieHeader];
            for (const cookieStr of cookieArray) {
              const parts = cookieStr.split(";");
              const [name, value] = parts[0].split("=");
              const options: Record<string, unknown> = {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
              };

              for (const part of parts.slice(1)) {
                const trimmed = part.trim();
                if (trimmed.toLowerCase() === "secure") {
                  options.secure = true;
                } else if (trimmed.toLowerCase().startsWith("expires=")) {
                  const expiresValue = trimmed.slice(8);
                  options.expires = new Date(expiresValue);
                } else if (trimmed.toLowerCase().startsWith("max-age=")) {
                  const maxAge = parseInt(trimmed.slice(8), 10);
                  options.maxAge = maxAge;
                }
              }

              response.cookies.set(name.trim(), value.trim(), options);
            }
          }
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

    // Return response with updated cookies if session was refreshed
    if (sessionRefreshed) {
      return response;
    }

    return NextResponse.next();
  } catch {
    // If there's an error checking session, assume not authenticated
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }
}
