Step 1: Demonstrate User Profile Access Controls
What to Show:

Log in as a regular user
Navigate to the user's profile page
Point out the "Test Salesforce Auth" button
Log out and log in as an admin user
Navigate to the same regular user's profile
Show that admin can also access the integration options
Narration Text: "The Salesforce integration is secured with proper access controls. Only the user themselves or administrators can access this functionality, as required in the integration task."

Step 2: Show the OAuth Authentication Flow
What to Show:

Click the "Test Salesforce Auth" button
Show the OAuth URL generation (can use browser developer tools)
Show the redirection to Salesforce login page
Enter Salesforce Developer credentials
Show the authorization confirmation page
Demonstrate successful redirection back to your application
Narration Text: "Our implementation uses the OAuth 2.0 standard for secure authentication with Salesforce. This flow securely exchanges an authorization code for access tokens that are stored in our database."

Step 3: Demonstrate the Data Collection Form
What to Show:

Click "Connect to Salesforce" to open the form
Highlight the four organized sections:
Company Information
Position Information
Address Information
Additional Information
Fill in complete information for a test company
Narration Text: "The form collects structured data following Salesforce's data model. We implement comprehensive validation to ensure data quality before submission."

Step 4: Showcase Data Transformation
What to Show:

Submit the form
Using browser developer tools, show the request payload
Highlight how the data is structured into Account and Contact objects
Narration Text: "Our integration transforms the collected form data into the structure expected by Salesforce API. The data is split into Account data for the company and Contact data for the individual user."

Step 5: Demonstrate Successful Record Creation
What to Show:

Show the success message after form submission
Open Salesforce in another browser tab
Log in to your Salesforce Developer account
Navigate to the Accounts tab
Find and open the newly created account
Show all the details match what was submitted
Navigate to the related Contacts list
Show the contact record linked to the account
Narration Text: "As required, the integration creates both an Account record and a linked Contact record in Salesforce. The parent-child relationship is properly established."

Step 6: Demonstrate Duplicate Handling
What to Show:

Log in as a different user
Complete the Salesforce authentication flow
Fill out the form using the same company name
Submit the form
Show the success message indicating existing records were found
Return to Salesforce
Show that a new Contact was added to the existing Account
Narration Text: "Our implementation includes sophisticated duplicate detection. When multiple users are from the same company, they share a single Account record in Salesforce while each getting their own Contact record."

Step 7: Show Permission Controls in API
What to Show:

Using developer tools or a tool like Postman
Attempt to access the API endpoint without authentication
Show the 401 error
Attempt to access another user's endpoint without admin rights
Show the 403 error
Narration Text: "The API endpoints enforce proper security controls, requiring authentication and verifying that users can only access their own data unless they're administrators."

Step 8: Demonstrate Error Handling
What to Show:

Deliberately trigger an error (e.g., disconnect internet or use invalid data)
Show the graceful error handling with user-friendly messages
Check browser console to show detailed error logging
Narration Text: "The integration includes robust error handling to provide clear feedback to users while maintaining detailed logs for troubleshooting."

Step 9: Show Token Management
What to Show:

Explain token storage and refresh mechanism
Show database structure with tokens (if applicable)
Demonstrate token refresh by performing an action after token expiration
Narration Text: "OAuth tokens are securely stored and managed. When tokens expire, our system automatically refreshes them to maintain a seamless user experience."

Step 10: Summary of Integration Requirements
What to Show:

Recap the key points of the integration
Show how each requirement was met:
Profile page action only for user/admin
Form to collect additional information
Account and Contact creation in Salesforce
REST API implementation
Security and error handling
Narration Text: "This implementation satisfies all requirements specified in the integration task. It securely connects users to Salesforce, collecting additional information and creating properly structured CRM records."
