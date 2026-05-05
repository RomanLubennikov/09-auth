import { NextRequest, NextResponse } from "next/server";
import { api, isAxiosError, logErrorResponse } from "../../api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await api.get("/users/me", {
      headers: {
        Cookie: cookieHeader,
      },
    });

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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await api.patch("/users/me", body, {
      headers: {
        Cookie: cookieHeader,
      },
    });

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
