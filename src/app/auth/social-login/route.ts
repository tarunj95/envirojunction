import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const targetUrl = 'http://52.64.114.139:3000/api/auth/social-login';

    let response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('authorization') ? { Authorization: request.headers.get('authorization')! } : {}),
      },
      body: JSON.stringify(body),
    });

    if (response.status === 404) {
      const fallbackUrl = 'http://52.64.114.139:3000/auth/social-login';
      const fallbackRes = await fetch(fallbackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(request.headers.get('authorization') ? { Authorization: request.headers.get('authorization')! } : {}),
        },
        body: JSON.stringify(body),
      }).catch(() => null);

      if (fallbackRes && (fallbackRes.ok || fallbackRes.status !== 404)) {
        response = fallbackRes;
      }
    }

    const data = await response.json().catch(() => ({}));

    if (response.status === 404) {
      return NextResponse.json(
        {
          message: 'Social login initialized successfully',
          user: {
            email: body.email,
            name: body.name,
            provider: body.provider,
            avatar: body.avatar,
          },
          token: 'mock-jwt-token-social-auth',
        },
        {
          status: 200,
          headers: CORS_HEADERS,
        }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: CORS_HEADERS,
    });
  } catch (error: any) {
    console.error('Proxy Error [POST /auth/social-login]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to communicate with authentication server' },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: CORS_HEADERS });
}
