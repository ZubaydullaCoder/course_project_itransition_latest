

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import salesforceAuthService from '@/lib/services/salesforce';
import SalesforceTokenService from '@/lib/services/salesforce-token';


export async function GET(request) {
  
  const searchParams = request.nextUrl.searchParams;
  const allParams = {};
  searchParams.forEach((value, key) => {
    allParams[key] = value;
  });
  console.log('All URL parameters:', allParams);

  
  const session = await auth();
  if (!session?.user) {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://course-project-itransition-form-builder-mu.vercel.app'
        : 'http://localhost:3000';

    return NextResponse.redirect(`${baseUrl}/login?error=Unauthorized`);
  }

  
  const code = searchParams.get('code');

  if (!code) {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://course-project-itransition-form-builder-mu.vercel.app'
        : 'http://localhost:3000';

    return NextResponse.redirect(`${baseUrl}/profile?error=NoCode`);
  }

  try {
    
    const tokenData = await salesforceAuthService.getTokenFromCode(code);

    
    await SalesforceTokenService.saveTokens(session.user.id, tokenData);

    
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://course-project-itransition-form-builder-mu.vercel.app'
        : 'http://localhost:3000';

    return NextResponse.redirect(
      `${baseUrl}/profile?success=SalesforceConnected`
    );
  } catch (error) {
    
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
