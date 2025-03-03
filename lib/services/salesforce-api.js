// lib/services/salesforce-api.js

import axios from 'axios';
import SalesforceTokenService from './salesforce-token';
import salesforceAuthService from './salesforce';

/**
 * Service to interact with Salesforce REST API
 */
class SalesforceApiService {
  /**
   * Get authorized API client with valid token
   * @param {string} userId - User ID
   * @returns {Promise<{axios: Object, instanceUrl: string}>} Axios instance and base URL
   */
  async getApiClient(userId) {
    // Get stored tokens for the user
    const tokenData = await SalesforceTokenService.getTokens(userId);
    if (!tokenData) {
      throw new Error('No Salesforce connection found for this user');
    }

    let { accessToken, refreshToken, expiresAt, instanceUrl } = tokenData;

    // Check if token is expired and refresh if needed
    if (SalesforceTokenService.isTokenExpired(expiresAt)) {
      try {
        const newTokenData =
          await salesforceAuthService.refreshToken(refreshToken);

        // Update tokens in database
        const updatedToken = await SalesforceTokenService.saveTokens(
          userId,
          newTokenData
        );
        accessToken = updatedToken.accessToken;
        instanceUrl = updatedToken.instanceUrl;
      } catch (error) {
        throw new Error('Failed to refresh Salesforce token');
      }
    }

    // Create and configure axios instance
    const client = axios.create({
      baseURL: `${instanceUrl}/services/data/v59.0`, // Using API version 59.0
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return { axios: client, instanceUrl };
  }

  /**
   * Create an Account in Salesforce
   * @param {string} userId - User ID
   * @param {Object} accountData - Account information
   * @returns {Promise<Object>} Created account response
   */
  async createAccount(userId, accountData) {
    const { axios } = await this.getApiClient(userId);

    try {
      const response = await axios.post('/sobjects/Account', accountData);
      return response.data;
    } catch (error) {
      console.error(
        'Error creating Salesforce Account:',
        error.response?.data || error.message
      );
      throw new Error('Failed to create Salesforce Account');
    }
  }

  /**
   * Create a Contact in Salesforce
   * @param {string} userId - User ID
   * @param {Object} contactData - Contact information including AccountId
   * @returns {Promise<Object>} Created contact response
   */
  async createContact(userId, contactData) {
    const { axios } = await this.getApiClient(userId);

    try {
      const response = await axios.post('/sobjects/Contact', contactData);
      return response.data;
    } catch (error) {
      console.error(
        'Error creating Salesforce Contact:',
        error.response?.data || error.message
      );
      throw new Error('Failed to create Salesforce Contact');
    }
  }

  /**
   * Create Account and linked Contact in a single operation
   * @param {string} userId - User ID
   * @param {Object} data - Combined account and contact data
   * @returns {Promise<Object>} Result with account and contact IDs
   */
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
    };
  }

  /**
   * Prepare Account and Contact data from form input
   * @param {Object} formData - Combined form data
   * @returns {Object} Separated account and contact data
   */
  prepareAccountContactData(formData) {
    // Extract account-specific fields
    const accountData = {
      Name: formData.companyName,
      Industry: formData.industry,
      BillingStreet: formData.address,
      BillingCity: formData.city,
      BillingState: formData.state,
      BillingPostalCode: formData.postalCode,
      BillingCountry: formData.country,
      Phone: formData.companyPhone,
      Website: formData.website,
      Description: formData.description,
    };

    // Extract contact-specific fields
    const contactData = {
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Email: formData.email,
      Phone: formData.phone,
      Title: formData.jobTitle,
      Department: formData.department,
    };

    return { accountData, contactData };
  }
}

// Create singleton instance
const salesforceApiService = new SalesforceApiService();
export default salesforceApiService;
