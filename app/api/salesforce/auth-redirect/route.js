// app/api/salesforce/auth-redirect/route.js
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import salesforceAuthService from '@/lib/services/salesforce';

export async function GET() {
  // Check if user is authenticated
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect('/login?error=Unauthorized');
  }

  // Generate authorization URL and redirect directly
  const authUrl = salesforceAuthService.getAuthorizationUrl();
  return NextResponse.redirect(authUrl);
}
