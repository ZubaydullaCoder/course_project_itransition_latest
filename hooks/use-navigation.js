
'use client';

import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useQueryParams } from '@/hooks/use-query-params';


export function useNavigation(options = {}) {
  const { baseUrl = '/templates' } = options;
  const { params, setParams } = useQueryParams({ baseUrl });

  
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
