import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://notehub-api.goit.study';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    
    // Forward cookies from the external API
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      const headers = new Headers();
      headers.append('set-cookie', setCookieHeader);
      return NextResponse.json(data, { headers });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
