import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiBaseUrl } from '@/utils/backend';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization') || '';
    const tokenCookie = request.cookies.get('token')?.value || '';
    const finalAuth = authHeader || (tokenCookie ? `Bearer ${tokenCookie}` : '');

    const apiBase = getBackendApiBaseUrl();
    const candidates = [
      `http://localhost:3000/users/toggle-follow/${encodeURIComponent(id)}`,
      `http://127.0.0.1:3000/users/toggle-follow/${encodeURIComponent(id)}`,
      `${apiBase}/users/toggle-follow/${encodeURIComponent(id)}`,
    ];

    let lastError: any = null;

    for (const url of candidates) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(finalAuth ? { Authorization: finalAuth } : {}),
          },
          signal: controller.signal,
        });
        clearTimeout(timeout);

        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          return NextResponse.json(data, {
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
          });
        }
        lastError = data;
      } catch {
        continue;
      }
    }

    return NextResponse.json(
      lastError || { message: 'Failed to update follow status' },
      { status: 500 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to toggle follow' },
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
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
