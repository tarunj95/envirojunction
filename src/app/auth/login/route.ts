import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiBaseUrl } from '@/utils/backend';
import { auth0, isAuth0Configured } from '@/lib/auth0';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (isAuth0Configured) {
    try {
      return await auth0.middleware(request);
    } catch (e) {
      console.error('[Auth0 Login GET error]', e);
    }
  }

  // If Auth0 is not configured or throws, redirect back to signin with status
  const signinUrl = request.nextUrl.clone();
  signinUrl.pathname = '/signin';
  signinUrl.search = 'error=sso_not_configured';
  return NextResponse.redirect(signinUrl);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin') || '*';
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
  };

  try {
    const body = await request.json();
    const apiBase = getBackendApiBaseUrl();
    const targetUrl = `${apiBase}/auth/login`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('authorization') ? { Authorization: request.headers.get('authorization')! } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, {
      status: response.status,
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error('Proxy Error [POST /auth/login]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to communicate with authentication server' },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '*';
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
      },
    }
  );
}
