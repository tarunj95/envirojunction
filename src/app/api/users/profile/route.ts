import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiBaseUrl } from '@/utils/backend';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin') || '*';
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  const authHeader = request.headers.get('authorization') || '';
  const tokenCookie = request.cookies.get('token')?.value || '';
  const finalAuth = authHeader || (tokenCookie ? `Bearer ${tokenCookie}` : '');

  const apiBase = getBackendApiBaseUrl();
  const candidates = [
    'http://localhost:3000/users/profile',
    'http://127.0.0.1:3000/users/profile',
    `${apiBase}/users/profile`,
  ];

  for (const url of candidates) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(finalAuth ? { Authorization: finalAuth } : {}),
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data, {
          status: res.status,
          headers: corsHeaders,
        });
      }
    } catch {
      continue;
    }
  }

  return NextResponse.json(
    { message: 'Profile could not be fetched' },
    { status: 404, headers: corsHeaders }
  );
}

export async function PATCH(request: NextRequest) {
  const origin = request.headers.get('origin') || '*';
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization') || '';
    const tokenCookie = request.cookies.get('token')?.value || '';
    const finalAuth = authHeader || (tokenCookie ? `Bearer ${tokenCookie}` : '');

    const apiBase = getBackendApiBaseUrl();
    const candidates = [
      'http://localhost:3000/users/profile',
      'http://127.0.0.1:3000/users/profile',
      `${apiBase}/users/profile`,
    ];

    let lastError: any = null;

    for (const url of candidates) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(finalAuth ? { Authorization: finalAuth } : {}),
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          return NextResponse.json(data, {
            status: res.status,
            headers: corsHeaders,
          });
        }
        lastError = data;
      } catch {
        continue;
      }
    }

    return NextResponse.json(
      lastError || { message: 'Failed to update user profile' },
      { status: 500, headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update profile' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
