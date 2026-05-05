import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://notehub-api.goit.study';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cookieHeader = request.headers.get('cookie') || '';

    // Build query parameters
    const params = new URLSearchParams();
    if (searchParams.get('search')) params.append('search', searchParams.get('search')!);
    if (searchParams.get('page')) params.append('page', searchParams.get('page')!);
    if (searchParams.get('tag')) params.append('tag', searchParams.get('tag')!);
    params.append('perPage', '12'); // Always set perPage to 12

    const response = await fetch(`${API_BASE_URL}/notes?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get notes error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
