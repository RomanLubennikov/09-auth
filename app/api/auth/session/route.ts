import { NextRequest, NextResponse } from "next/server";
import { api, isAxiosError, logErrorResponse } from "../../api";

export async function GET(request: NextRequest) {
  try {
    // Get cookies from the request
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await api.get("/auth/session", {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    logErrorResponse(error);
    if (isAxiosError(error) && error.response?.status === 401) {
      return NextResponse.json(null, { status: 200 });
    }
    return NextResponse.json(null, { status: 200 });
  }
}
