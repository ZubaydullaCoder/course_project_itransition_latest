Here's your **Salesforce Integration Demonstration Guide** formatted beautifully in **Markdown**:

````markdown
# Salesforce Integration Demonstration Guide with Case Examples

This guide walks through each step of demonstrating the Salesforce integration in your application, with specific explanations and case examples for each component.

---

## 1. User Profile Access

**Explanation:**  
The Salesforce integration is available only to the user themselves or administrators.

**Case Example:**

- **Regular User:** Jane Smith logs in and navigates to her profile page. She can see the Salesforce integration options because she's viewing her own profile.
- **Admin User:** Administrator Alex logs in and can access Jane's profile. Despite not being Jane, Alex can see the Salesforce integration options because of admin privileges.

**Code Highlight:**

```javascript
const canAccessSalesforce =
  session?.user?.id === user.id || session?.user?.role === 'ADMIN';
```
````

---

## 2. Authentication Flow

**Explanation:**  
The integration uses OAuth 2.0 for secure authentication with Salesforce.

**Case Example:**  
Jane clicks the "Test Salesforce Auth" button. The application generates a special URL that redirects her to Salesforce's login page. After entering her Salesforce credentials, Salesforce redirects her back to your application with an authorization code, which is exchanged for access tokens.

**Technical Flow:**

1. Button click calls `/api/salesforce/auth` endpoint.
2. Server generates OAuth URL with client ID and redirect URI.
3. User gets redirected to Salesforce's authorization page.
4. After authorization, Salesforce redirects back with a code.
5. Backend exchanges code for tokens and stores them securely.

**Code Highlight:**

```javascript
// Frontend button triggers auth
const response = await fetch('/api/salesforce/auth');
const data = await response.json();
window.open(data.authUrl, '_blank');

// Backend callback handles the response
const tokenData = await salesforceAuthService.getTokenFromCode(code);
await SalesforceTokenService.saveTokens(session.user.id, tokenData);
```

---

## 3. Form Collection

**Explanation:**  
The form collects additional information about the user to create Salesforce records.

**Case Example:**  
After successful authentication, Jane clicks "Connect to Salesforce" and fills out a form with:

- **Company Info:** "TechCorp Inc.", Industry: "Technology"
- **Position:** "Marketing Manager", Department: "Marketing"
- **Address:** "123 Main St, Boston, MA 02108"
- **Additional Notes:** Custom input for specific requirements.

**Form Structure:**

- Company section (name, industry, website, phone)
- Position section (job title, department, personal phone)
- Address section (street, city, state, postal code, country)
- Additional information (free text)

**Code Highlight:**

```javascript
// Form validation schema
const formSchema = z.object({
  companyName: z.string().min(2, {
    message: 'Company name must be at least 2 characters.',
  }),
  industry: z.string().min(1, {
    message: 'Please select an industry.',
  }),
  // Additional fields...
});
```

---

## 4. Data Transformation

**Explanation:**  
The application transforms form data into the structure expected by Salesforce.

**Case Example:**  
Jane's form submission gets transformed into structured data. Her name "Jane Smith" is split into `"Jane"` (**FirstName**) and `"Smith"` (**LastName**). The form data is divided into **Account data** (company information) and **Contact data** (personal information).

**Technical Process:**

1. Form data is combined with user data (name, email).
2. Data is restructured into Salesforce-specific formats.
3. Account data is prepared first (Name, Industry, Website, etc.).
4. Contact data is prepared with appropriate field mappings.

**Code Highlight:**

```javascript
prepareAccountContactData(formData) {
  // Prepare Account data
  const accountData = {
    Name: formData.companyName,
    Industry: formData.industry,
    Website: formData.website,
    Phone: formData.companyPhone,
    BillingStreet: formData.address,
    BillingCity: formData.city,
    // More fields...
  };

  // Prepare Contact data
  const contactData = {
    FirstName: formData.firstName,
    LastName: formData.lastName,
    Email: formData.email,
    Title: formData.jobTitle,
    Department: formData.department,
    // More fields...
  };

  return { accountData, contactData };
}
```

---

## 5. API Communication

**Explanation:**  
The application sends the prepared data to Salesforce via secure REST API calls.

**Case Example:**  
The system sends a request to create an **Account** for `"TechCorp Inc."` in Salesforce. After successful Account creation, it sends another request to create a **Contact record** for `"Jane Smith"` linked to the TechCorp Account.

**Technical Flow:**

1. System retrieves stored access token for Jane.
2. If token is expired, it's automatically refreshed.
3. First API call creates the Account.
4. Second API call creates the Contact with AccountId reference.
5. Both calls include proper authentication headers.

**Code Highlight:**

```javascript
async createAccountWithContact(userId, data) {
  const { accountData, contactData } = this.prepareAccountContactData(data);

  // Create Account first
  const accountResult = await this.createAccount(userId, accountData);

  // Then create Contact linked to the Account
  const contactWithAccount = {
    ...contactData,
    AccountId: accountResult.id,
  };

  const contactResult = await this.createContact(userId, contactWithAccount);

  return {
    accountId: accountResult.id,
    contactId: contactResult.id,
    success: true,
    isDuplicate: contactResult.isDuplicate || false,
  };
}
```

---

## 6. Duplicate Handling

**Explanation:**  
The system gracefully handles duplicate records to prevent errors.

**Case Example:**  
Jane has already created a `"TechCorp Inc."` account. The system detects the duplicate, retrieves the existing record's ID, and uses it for the Contact association.

**Code Highlight:**

```javascript
// Duplicate detection in createAccount method
if (error.response?.data[0]?.errorCode === 'DUPLICATES_DETECTED') {
  console.log('Duplicate account detected, returning existing account info');

  // Query to find the existing account by name
  const query = `SELECT Id FROM Account WHERE Name = '${encodedName}' LIMIT 1`;
  const queryResponse = await axios.get(
    `/query?q=${encodeURIComponent(query)}`
  );

  if (queryResponse.data.records.length > 0) {
    return {
      id: queryResponse.data.records[0].Id,
      success: true,
      isDuplicate: true,
    };
  }
}
```

---

## 7. Permission Controls

**Explanation:**  
The API endpoint enforces proper permission controls for security.

**Code Highlight:**

```javascript
// API permission checks
const session = await auth();
if (!session?.user) {
  return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
}

// Verify permission (only self or admin)
if (session.user.id !== userId && session.user.role !== 'ADMIN') {
  return NextResponse.json(
    { error: 'You do not have permission to perform this action' },
    { status: 403 }
  );
}
```

---

## 8. Token Management

**Explanation:**  
The system securely stores and manages Salesforce tokens.

**Code Highlight:**

```javascript
// Checking for token expiration and refreshing
if (SalesforceTokenService.isTokenExpired(expiresAt)) {
  try {
    const newTokenData = await salesforceAuthService.refreshToken(refreshToken);

    // Update tokens in database
    const updatedToken = await SalesforceTokenService.saveTokens(
      userId,
      newTokenData
    );
    accessToken = updatedToken.accessToken;
    instanceUrl = updatedToken.instanceUrl;
  } catch (refreshError) {
    console.error('Error refreshing token:', refreshError);
    throw new Error('Failed to refresh Salesforce token');
  }
}
```

---

## 9. Success Feedback & Verification in Salesforce

**Explanation:**  
Users receive clear feedback and can verify records in Salesforce.

**Verification Steps:**

1. Login to Salesforce Developer org.
2. Navigate to **Accounts** tab.
3. Find account matching form submission.
4. Check related **Contacts** for the linked record.

```

Let me know if you need any changes or additional formatting! 🚀
```
