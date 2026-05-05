import { NextRequest, NextResponse } from "next/server";
import { api, isAxiosError, logErrorResponse } from "../api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cookieHeader = request.headers.get("cookie") || "";

    // Build query parameters
    const params: Record<string, string> = {};
    const search = searchParams.get("search");
    const page = searchParams.get("page");
    const tag = searchParams.get("tag");
    const perPage = searchParams.get("perPage") || "12";

    if (search) params.search = search;
    if (page) params.page = page;
    if (tag && tag !== "All") params.tag = tag;
    params.perPage = perPage;

    const response = await api.get("/notes", {
      params,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await api.post("/notes", body, {
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
