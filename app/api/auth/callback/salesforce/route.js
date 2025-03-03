// app/api/auth/callback/salesforce/route.js

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import salesforceAuthService from '@/lib/services/salesforce';
import SalesforceTokenService from '@/lib/services/salesforce-token';

// Check what's actually in the URL parameters
export async function GET(request) {
  // Add debug logging
  const searchParams = request.nextUrl.searchParams;
  const allParams = {};
  searchParams.forEach((value, key) => {
    allParams[key] = value;
  });
  console.log('All URL parameters:', allParams);

  // Check if user is authenticated
  const session = await auth();
  if (!session?.user) {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://course-project-itransition-form-builder-mu.vercel.app'
        : 'http://localhost:3000';

    return NextResponse.redirect(`${baseUrl}/login?error=Unauthorized`);
  }

  // Get authorization code from query params
  const code = searchParams.get('code');

  if (!code) {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://course-project-itransition-form-builder-mu.vercel.app'
        : 'http://localhost:3000';

    return NextResponse.redirect(`${baseUrl}/profile?error=NoCode`);
  }

  try {
    // Exchange code for tokens
    const tokenData = await salesforceAuthService.getTokenFromCode(code);

    // Save tokens to database
    await SalesforceTokenService.saveTokens(session.user.id, tokenData);

    // Redirect back to profile page with success message
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://course-project-itransition-form-builder-mu.vercel.app'
        : 'http://localhost:3000';

    return NextResponse.redirect(
      `${baseUrl}/profile?success=SalesforceConnected`
    );
  } catch (error) {
    // Fix the error handling to ensure we're not passing null to console.error
    console.error(
      'Salesforce authentication error:',
      error.message || 'Unknown error'
    );

    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://course-project-itransition-form-builder-mu.vercel.app'
        : 'http://localhost:3000';

    return NextResponse.redirect(`${baseUrl}/profile?error=AuthFailed`);
  }
}
