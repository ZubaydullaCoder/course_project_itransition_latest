// app/api/salesforce/auth/route.js

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import salesforceAuthService from '@/lib/services/salesforce';

export async function GET() {
  // Check if user is authenticated
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Generate and return the authorization URL
  const authUrl = salesforceAuthService.getAuthorizationUrl();
  return NextResponse.json({ authUrl });
}
