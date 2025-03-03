// app/api/salesforce/create-account/route.js

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import salesforceApiService from '@/lib/services/salesforce-api';

/**
 * API endpoint to create Salesforce Account and Contact
 */
export async function POST(request) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Parse request body
    const data = await request.json();
    const { userId } = data;

    // Verify permission (only self or admin)
    if (session.user.id !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not have permission to perform this action' },
        { status: 403 }
      );
    }

    // Create Account and Contact in Salesforce
    const result = await salesforceApiService.createAccountWithContact(
      session.user.id,
      data
    );

    // Track Salesforce integration in user record (optional)
    // You could add code here to update your user's record with Salesforce IDs

    return NextResponse.json({
      success: true,
      message: 'Successfully created Salesforce records',
      accountId: result.accountId,
      contactId: result.contactId,
    });
  } catch (error) {
    console.error('Error creating Salesforce records:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Salesforce records' },
      { status: 500 }
    );
  }
}
