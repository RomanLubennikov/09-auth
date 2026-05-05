// Utility functions for API routes

export function getCookieHeader(request: Request): string {
  return request.headers.get('cookie') || '';
}

export function createResponseWithCookies(data: any, setCookieHeader?: string | null) {
  const headers = new Headers();
  
  if (setCookieHeader) {
    headers.append('set-cookie', setCookieHeader);
  }
  
  headers.append('content-type', 'application/json');
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers,
  });
}

export function createErrorResponse(message: string, status: number = 500) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export function clearCookiesResponse() {
  const headers = new Headers();
  headers.append('set-cookie', 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax');
  headers.append('set-cookie', 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax');
  headers.append('content-type', 'application/json');
  
  return new Response(JSON.stringify({}), {
    status: 200,
    headers,
  });
}
