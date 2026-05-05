import { NextRequest, NextResponse } from "next/server";
import { api, isAxiosError, logErrorResponse } from "../../api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await api.post("/auth/login", body);

    // Forward cookies from the external API
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      const headers = new Headers();
      if (Array.isArray(setCookieHeader)) {
        setCookieHeader.forEach((cookie) => {
          headers.append("set-cookie", cookie);
        });
      } else {
        headers.append("set-cookie", setCookieHeader);
      }
      return NextResponse.json(response.data, { headers });
    }

    return NextResponse.json(response.data);
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
