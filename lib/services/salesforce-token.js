// lib/services/salesforce-token.js

import prisma from '../prisma/client';

/**
 * Service to manage Salesforce tokens in the database
 */
export default class SalesforceTokenService {
  /**
   * Save Salesforce tokens for a user
   * @param {string} userId - User ID
   * @param {Object} tokenData - Token data from Salesforce
   * @returns {Promise<Object>} Saved token record
   */
  static async saveTokens(userId, tokenData) {
    const { access_token, refresh_token, instance_url, expires_in } = tokenData;

    // Calculate expiry time - ensure expires_in is a valid number
    let expiresAt;

    if (expires_in && !isNaN(parseInt(expires_in))) {
      expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + parseInt(expires_in));
    } else {
      // Default to 2 hours if no valid expires_in is provided
      expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 2);
    }

    // Debug information
    console.log('Token Data:', {
      userId,
      accessToken: access_token ? 'present' : 'missing',
      refreshToken: refresh_token ? 'present' : 'missing',
      instanceUrl: instance_url,
      expiresIn: expires_in,
      calculatedExpiresAt: expiresAt,
    });

    // Upsert token record
    return prisma.salesforceToken.upsert({
      where: { userId },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        instanceUrl: instance_url,
        expiresAt,
      },
      create: {
        userId,
        accessToken: access_token,
        refreshToken: refresh_token,
        instanceUrl: instance_url,
        expiresAt,
      },
    });
  }

  /**
   * Get tokens for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Token record or null
   */
  static async getTokens(userId) {
    return prisma.salesforceToken.findUnique({
      where: { userId },
    });
  }

  /**
   * Check if token is expired and needs refresh
   * @param {Date} expiresAt - Token expiry time
   * @returns {boolean} True if token needs refresh
   */
  static isTokenExpired(expiresAt) {
    const now = new Date();
    // Add buffer of 5 minutes
    now.setMinutes(now.getMinutes() + 5);
    return now >= new Date(expiresAt);
  }
}
