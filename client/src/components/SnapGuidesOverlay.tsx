/**
 * SnapGuidesOverlay Component
 * Displays snap guides and alignment helpers
 */

import React from 'react';
import { SnapGuide } from '@/types';

interface SnapGuidesOverlayProps {
  guides: SnapGuide[];
  canvasWidth: number;
  canvasHeight: number;
}

export const SnapGuidesOverlay: React.FC<SnapGuidesOverlayProps> = ({
  guides,
  canvasWidth,
  canvasHeight,
}) => {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={canvasWidth}
      height={canvasHeight}
      style={{ zIndex: 1 }}
    >
      {/* Vertical guides */}
      {guides
        .filter((g) => g.type === 'vertical' && g.visible)
        .map((guide, idx) => (
          <line
            key={`v-${idx}`}
            x1={guide.position}
            y1={0}
            x2={guide.position}
            y2={canvasHeight}
            stroke="#3b82f6"
            strokeWidth="1"
            strokeDasharray="4,4"
            opacity="0.6"
          />
        ))}

      {/* Horizontal guides */}
      {guides
        .filter((g) => g.type === 'horizontal' && g.visible)
        .map((guide, idx) => (
          <line
            key={`h-${idx}`}
            x1={0}
            y1={guide.position}
            x2={canvasWidth}
            y2={guide.position}
            stroke="#3b82f6"
            strokeWidth="1"
            strokeDasharray="4,4"
            opacity="0.6"
          />
        ))}

      {/* Center guides */}
      <line
        x1={canvasWidth / 2}
        y1={0}
        x2={canvasWidth / 2}
        y2={canvasHeight}
        stroke="#ef4444"
        strokeWidth="1"
        strokeDasharray="2,2"
        opacity="0.3"
      />
      <line
        x1={0}
        y1={canvasHeight / 2}
        x2={canvasWidth}
        y2={canvasHeight / 2}
        stroke="#ef4444"
        strokeWidth="1"
        strokeDasharray="2,2"
        opacity="0.3"
      />
    </svg>
  );
};
