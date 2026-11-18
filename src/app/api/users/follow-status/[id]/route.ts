import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiBaseUrl } from '@/utils/backend';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization') || '';
    const tokenCookie = request.cookies.get('token')?.value || '';
    const finalAuth = authHeader || (tokenCookie ? `Bearer ${tokenCookie}` : '');

    const apiBase = getBackendApiBaseUrl();
    const candidates = [
      `http://localhost:3000/users/follow-status/${encodeURIComponent(id)}`,
      `http://127.0.0.1:3000/users/follow-status/${encodeURIComponent(id)}`,
      `${apiBase}/users/follow-status/${encodeURIComponent(id)}`,
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
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
          });
        }
      } catch {
        continue;
      }
    }

    return NextResponse.json(
      { isFollowing: false, followersCount: 0, organisationId: id },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch follow status' },
      { status: 500 }
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
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
