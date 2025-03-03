// lib/services/salesforce.js

import axios from 'axios';

/**
 * Salesforce OAuth authentication service
 */
class SalesforceAuthService {
  constructor() {
    this.clientId = process.env.SALESFORCE_CLIENT_ID;
    this.clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
    this.loginUrl = process.env.SALESFORCE_LOGIN_URL;

    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('SALESFORCE_LOGIN_URL:', this.loginUrl);
    // Update to match the exact URL configured in Salesforce
    this.redirectUri =
      process.env.NODE_ENV === 'production'
        ? 'https://course-project-itransition-form-builder-mu.vercel.app/api/auth/callback/salesforce'
        : `http://localhost:3000/api/auth/callback/salesforce`;

    this.tokenUrl = `${this.loginUrl}/services/oauth2/token`;
  }

  /**
   * Generate the authorization URL for OAuth flow
   * @returns {string} Authorization URL
   */
  getAuthorizationUrl() {
    return (
      `${this.loginUrl}/services/oauth2/authorize?` +
      `client_id=${encodeURIComponent(this.clientId)}` +
      `&redirect_uri=${encodeURIComponent(this.redirectUri)}` +
      `&response_type=code` +
      `&state=${this._generateState()}`
    ); // Add state parameter for security
  }

  /**
   * Exchange authorization code for access token
   * @param {string} code - Authorization code from callback
   * @returns {Promise<Object>} Token response
   */
  async getTokenFromCode(code) {
    try {
      const response = await axios.post(this.tokenUrl, null, {
        params: {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          code: code,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Add this debug information
      console.log(
        'Salesforce token response structure:',
        Object.keys(response.data).join(', ')
      );

      // Ensure expires_in is a number
      if (response.data.expires_in) {
        response.data.expires_in = parseInt(response.data.expires_in);
      } else {
        // Default to 2 hours (7200 seconds)
        response.data.expires_in = 7200;
      }

      return response.data;
    } catch (error) {
      console.error(
        'Error exchanging code for token:',
        error.response?.data || error.message
      );

      // Improve error message based on actual error
      if (error.response?.data?.error === 'invalid_grant') {
        throw new Error('Authorization code has expired. Please try again.');
      }

      throw new Error(
        'Failed to authenticate with Salesforce: ' +
          (error.response?.data?.error_description || error.message)
      );
    }
  }

  /**
   * Refresh an expired access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New token response
   */
  async refreshToken(refreshToken) {
    try {
      const response = await axios.post(this.tokenUrl, null, {
        params: {
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        'Error refreshing token:',
        error.response?.data || error.message
      );
      throw new Error('Failed to refresh Salesforce token');
    }
  }

  /**
   * Generate a random state parameter to prevent CSRF attacks
   * @private
   * @returns {string} Random state string
   */
  _generateState() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}

// Create singleton instance
const salesforceAuthService = new SalesforceAuthService();
export default salesforceAuthService;
