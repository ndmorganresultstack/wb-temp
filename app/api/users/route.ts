// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { trackTrace, trackException } from '@/lib/appInsights';

export async function GET(request: NextRequest) {
  try {
    // Log the API request
    trackTrace('Users API endpoint called', {
      url: request.url,
      method: request.method,
    });

    const baseUrl = process.env.SWA_BASE_URL || '';
    const authUrl = `${baseUrl}/.auth/me`;
    const response = await fetch(authUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      trackTrace('Users API: Auth fetch failed', {
        status: response.status,
        statusText: response.statusText,
      });
      return NextResponse.json(
        { error: 'Failed to fetch user info' },
        { status: response.status }
      );
    }

    const payload = await response.json();
    const { clientPrincipal } = payload;

    // Log successful response
    trackTrace('Users API: Auth payload received', {
      userId: clientPrincipal?.userId || 'unknown',
      identityProvider: clientPrincipal?.identityProvider || 'unknown',
    });

    return NextResponse.json(clientPrincipal);
  } catch (error: any) {
    // Log any errors
    trackException(error, { endpoint: '/api/users', url: request.url });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
      
    );
  }
}