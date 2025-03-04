// hooks/use-carousel-config.js
'use client';

import { useMemo } from 'react';
import { A11y, Navigation, Pagination } from 'swiper/modules';

/**
 * Hook to manage carousel configuration and placeholder slots
 * @param {Object} options - Carousel options
 * @param {Array} options.items - Items to display in carousel
 * @param {number} options.maxSlots - Maximum number of slots to show (includes placeholders)
 * @param {Object} options.breakpoints - Responsive breakpoints configuration
 * @returns {Object} Carousel configuration and placeholder information
 */
export function useCarouselConfig({
  items = [],
  maxSlots = 5,
  breakpoints = {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
}) {
  // Calculate empty slots needed for placeholders
  const emptySlots = useMemo(() => {
    return Math.max(0, maxSlots - items.length);
  }, [items.length, maxSlots]);

  // Generate placeholder array
  const placeholders = useMemo(() => {
    return Array(emptySlots).fill(null);
  }, [emptySlots]);

  // Default carousel configuration
  const carouselConfig = {
    modules: [Navigation, Pagination, A11y],
    spaceBetween: 30,
    slidesPerView: 1,
    navigation: true,
    pagination: { clickable: true },
    breakpoints,
    className: 'w-full',
  };

  return {
    items,
    placeholders,
    carouselConfig,
    totalSlots: items.length + emptySlots,
  };
}
