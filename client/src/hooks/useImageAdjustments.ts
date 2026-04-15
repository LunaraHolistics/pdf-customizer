/**
 * useImageAdjustments Hook
 * Manages image filter adjustments (brightness, contrast, saturation, opacity, etc.)
 */

import { useCallback } from 'react';
import { ImageAdjustments } from '@/types';

interface UseImageAdjustmentsReturn {
  getFilterString: (adjustments: ImageAdjustments) => string;
  getDefaultAdjustments: () => ImageAdjustments;
  applyAdjustments: (
    element: HTMLElement,
    adjustments: ImageAdjustments
  ) => void;
}

export const useImageAdjustments = (): UseImageAdjustmentsReturn => {
  // Get CSS filter string from adjustments
  const getFilterString = useCallback((adjustments: ImageAdjustments): string => {
    const filters: string[] = [];

    if (adjustments.brightness !== 0) {
      filters.push(`brightness(${100 + adjustments.brightness}%)`);
    }

    if (adjustments.contrast !== 0) {
      filters.push(`contrast(${100 + adjustments.contrast}%)`);
    }

    if (adjustments.saturation !== 0) {
      filters.push(`saturate(${100 + adjustments.saturation}%)`);
    }

    if (adjustments.hueRotate !== 0) {
      filters.push(`hue-rotate(${adjustments.hueRotate}deg)`);
    }

    return filters.join(' ');
  }, []);

  // Get default adjustments
  const getDefaultAdjustments = useCallback((): ImageAdjustments => {
    return {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      opacity: 100,
      hueRotate: 0,
    };
  }, []);

  // Apply adjustments to HTML element
  const applyAdjustments = useCallback(
    (element: HTMLElement, adjustments: ImageAdjustments) => {
      const filterString = getFilterString(adjustments);
      element.style.filter = filterString;
      element.style.opacity = `${adjustments.opacity / 100}`;
    },
    [getFilterString]
  );

  return {
    getFilterString,
    getDefaultAdjustments,
    applyAdjustments,
  };
};
