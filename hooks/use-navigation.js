// hooks/use-navigation.js
'use client';

import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useQueryParams } from '@/hooks/use-query-params';

/**
 * Custom hook for handling navigation-related functionality
 * @param {Object} options - Configuration options
 * @returns {Object} Navigation helper functions
 */
export function useNavigation(options = {}) {
  const { baseUrl = '/templates' } = options;
  const { params, setParams } = useQueryParams({ baseUrl });

  /**
   * Handle topic change in template navigation
   * @param {string} topic - Selected topic
   */
  const handleTopicChange = useCallback(
    (topic) => {
      setParams({
        topic: topic === 'all' ? '' : topic,
        // Preserve other query params
      });
    },
    [setParams]
  );

  /**
   * Handle user sign out with path storage
   * @param {Object} user - Current user object
   */
  const handleSignOut = useCallback(async (user) => {
    const currentPath = window.location.pathname + window.location.search;
    if (
      currentPath !== '/' &&
      currentPath !== '/login' &&
      currentPath !== '/register'
    ) {
      // Store both the user's email and the path
      if (user?.email) {
        localStorage.setItem(
          `returnPath_${encodeURIComponent(user.email)}`,
          currentPath
        );
      }
    }

    await signOut({
      redirect: true,
      callbackUrl: '/',
    });
  }, []);

  return {
    handleTopicChange,
    handleSignOut,
    currentTopic: params.topic || 'all',
  };
}
