import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiBaseUrl } from '@/utils/backend';
import { professionals as mockProfessionals } from '@/lib/data';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const apiBase = getBackendApiBaseUrl();

    // 1. Try directly requesting user by ID from backend
    try {
      const response = await fetch(`${apiBase}/users/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(request.headers.get('authorization') ? { Authorization: request.headers.get('authorization')! } : {}),
        },
      });

      if (response.ok) {
        const user = await response.json();
        if (user && (user._id || user.id || user.name)) {
          return NextResponse.json(user, {
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
          });
        }
      }
    } catch (directErr) {
      console.warn(`[Proxy /api/users/${id}] Direct endpoint error, falling back to list:`, directErr);
    }

    // 2. Fallback: Search in user list
    const listResponse = await fetch(`${apiBase}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('authorization') ? { Authorization: request.headers.get('authorization')! } : {}),
      },
    });

    if (listResponse.ok) {
      const data = await listResponse.json();
      const list = Array.isArray(data) ? data : (data?.data || []);
      const matched = list.find((u: any) => 
        (u._id && String(u._id) === id) || 
        (u.id && String(u.id) === id)
      );

      if (matched) {
        return NextResponse.json(matched, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
      }
    }

    // 3. Fallback: Search in curated mock professionals
    const mockMatch = mockProfessionals.find((p) => p.id === id);
    if (mockMatch) {
      return NextResponse.json(mockMatch, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    return NextResponse.json(
      { error: 'User not found' },
      {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error: any) {
    console.error(`Proxy Error [GET /api/users/:id]:`, error);
    return NextResponse.json(
      { error: error?.message || 'Failed to communicate with API server' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
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
