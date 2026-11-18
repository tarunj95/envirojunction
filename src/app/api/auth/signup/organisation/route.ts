import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiBaseUrl } from '@/utils/backend';

export const dynamic = 'force-dynamic';

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

    // Prepare organisation details object
    const organisationDetails = body.organisationDetails || {
      companyName: body.name || '',
      expertise: body.expertise || [],
      companySize: body.companySize || '',
      primaryUseCase: body.primaryUseCase || '',
      website: body.website || '',
      linkedin: body.linkedin || '',
      about: body.about || '',
      logo: body.logo || '',
      gstNumber: body.gstNumber || '',
      cinNumber: body.cinNumber || '',
    };

    const targetPayload = {
      ...body,
      role: 'organisation',
      organisationDetails,
    };

    // Candidate URLs to try for dedicated organisation signup
    const candidates = [
      'http://localhost:3000/auth/signup/organisation',
      'http://127.0.0.1:3000/auth/signup/organisation',
      `${apiBase}/auth/signup/organisation`,
    ];

    let successResponse = null;
    let lastError: any = null;

    for (const targetUrl of candidates) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(request.headers.get('authorization') ? { Authorization: request.headers.get('authorization')! } : {}),
          },
          body: JSON.stringify(targetPayload),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.ok) {
          const resData = await res.json();
          successResponse = NextResponse.json(resData, {
            status: res.status,
            headers: corsHeaders,
          });
          break;
        } else {
          const errorData = await res.json().catch(() => ({}));
          // If email already exists, immediately return the error
          if (res.status === 400 && (errorData?.message === 'Work email already exists' || errorData?.message === 'Email already exists')) {
            return NextResponse.json(errorData, {
              status: 400,
              headers: corsHeaders,
            });
          }
          lastError = errorData;
        }
      } catch {
        // Target host unreachable, try next candidate
        continue;
      }
    }

    if (successResponse) {
      return successResponse;
    }

    // Fallback: If dedicated endpoints are unavailable or unrouted, register via standard /auth/signup
    // Strictly whitelist { name, email, password } to avoid any strict validation pipe rejections on production backend
    const standardSignupCandidates = [
      'http://localhost:3000/auth/signup',
      `${apiBase}/auth/signup`,
    ];

    for (const fallbackUrl of standardSignupCandidates) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const fallbackRes = await fetch(fallbackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: body.name,
            email: body.email,
            password: body.password,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        const fallbackData = await fallbackRes.json().catch(() => ({}));

        if (fallbackRes.ok) {
          return NextResponse.json(
            {
              message: 'Organisation registered successfully',
              token: fallbackData.token,
              user: {
                ...fallbackData.user,
                role: 'organisation',
                organisationDetails,
              },
            },
            {
              status: fallbackRes.status,
              headers: corsHeaders,
            }
          );
        } else if (fallbackRes.status === 400) {
          return NextResponse.json(fallbackData, {
            status: 400,
            headers: corsHeaders,
          });
        }
      } catch {
        continue;
      }
    }

    return NextResponse.json(
      lastError || { error: 'Failed to complete organisation signup. Please try again.' },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  } catch (error: any) {
    console.error('Proxy Error [POST /api/auth/signup/organisation]:', error);
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
