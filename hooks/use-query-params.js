
'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string'; 


export function useQueryParams(options = {}) {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { baseUrl = '' } = options;

  /**
   * Get current query params as an object
   */
  const getParams = useCallback(() => {
    // We ensure searchParams exists before using it
    if (!searchParams) return {};
    return qs.parse(searchParams.toString());
  }, [searchParams]);

  /**
   * Set or update query parameters
   * @param {Object} updates - Key-value pairs to update in the query string
   * @param {Object} options - Additional options for navigation
   * @param {boolean} options.replace - Whether to replace current history entry
   */
  const setParams = useCallback(
    (updates, { replace = false } = {}) => {
      // Early return if no router
      if (!router) return {};

      const current = getParams();
      const updated = { ...current };

      // Process updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          delete updated[key];
        } else {
          updated[key] = value;
        }
      });

      // Generate the new URL
      const path =
        typeof window !== 'undefined' ? window.location.pathname : '';
      const url = qs.stringifyUrl(
        {
          url: baseUrl || path,
          query: updated,
        },
        { skipNull: true, skipEmptyString: true }
      );

      
      if (replace) {
        router.replace(url);
      } else {
        router.push(url);
      }

      return updated;
    },
    [router, getParams, baseUrl]
  );

  
  const toggleParam = useCallback(
    (key, value) => {
      const current = getParams();
      const currentValue = current[key];

      
      if (currentValue === value) {
        return setParams({ [key]: undefined });
      }
      
      return setParams({ [key]: value });
    },
    [getParams, setParams]
  );

  
  const currentParams = getParams();

  return {
    params: currentParams,
    getParams,
    setParams,
    toggleParam,
    searchParams,
  };
}
