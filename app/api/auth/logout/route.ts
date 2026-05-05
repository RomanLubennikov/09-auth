import { NextRequest, NextResponse } from "next/server";
import { api, isAxiosError, logErrorResponse } from "../../api";

export async function POST(request: NextRequest) {
  try {
    // Get cookies from the request
    const cookieHeader = request.headers.get("cookie") || "";

    await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
    );

    // Clear cookies by setting them to expire
    const headers = new Headers();
    headers.append(
      "set-cookie",
      "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax"
    );
    headers.append(
      "set-cookie",
      "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax"
    );

    return NextResponse.json({}, { headers });
  } catch (error) {
    logErrorResponse(error);
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
