/**
 * PrintMarginGuides Component
 * Displays print margins and alignment guides on the canvas
 */

import React from 'react';

interface PrintMarginGuidesProps {
  canvasWidth: number;
  canvasHeight: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  showGrid?: boolean;
  gridSize?: number;
}

export const PrintMarginGuides: React.FC<PrintMarginGuidesProps> = ({
  canvasWidth,
  canvasHeight,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20,
  showGrid = true,
  gridSize = 50,
}) => {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={canvasWidth}
      height={canvasHeight}
      style={{ zIndex: 0 }}
    >
      <defs>
        <pattern
          id="grid"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      {/* Grid background */}
      {showGrid && (
        <rect width={canvasWidth} height={canvasHeight} fill="url(#grid)" />
      )}

      {/* Print margins - outer border */}
      <rect
        x={marginLeft}
        y={marginTop}
        width={canvasWidth - marginLeft - marginRight}
        height={canvasHeight - marginTop - marginBottom}
        fill="none"
        stroke="#ef4444"
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.7"
      />

      {/* Margin labels */}
      <text
        x={marginLeft + 5}
        y={marginTop - 5}
        fontSize="10"
        fill="#ef4444"
        opacity="0.7"
      >
        Margem: {marginTop}pt
      </text>

      {/* Center guides */}
      <line
        x1={canvasWidth / 2}
        y1={marginTop}
        x2={canvasWidth / 2}
        y2={canvasHeight - marginBottom}
        stroke="#3b82f6"
        strokeWidth="1"
        strokeDasharray="3,3"
        opacity="0.5"
      />
      <line
        x1={marginLeft}
        y1={canvasHeight / 2}
        x2={canvasWidth - marginRight}
        y2={canvasHeight / 2}
        stroke="#3b82f6"
        strokeWidth="1"
        strokeDasharray="3,3"
        opacity="0.5"
      />

      {/* Corner markers */}
      <circle
        cx={marginLeft}
        cy={marginTop}
        r="3"
        fill="#ef4444"
        opacity="0.5"
      />
      <circle
        cx={canvasWidth - marginRight}
        cy={marginTop}
        r="3"
        fill="#ef4444"
        opacity="0.5"
      />
      <circle
        cx={marginLeft}
        cy={canvasHeight - marginBottom}
        r="3"
        fill="#ef4444"
        opacity="0.5"
      />
      <circle
        cx={canvasWidth - marginRight}
        cy={canvasHeight - marginBottom}
        r="3"
        fill="#ef4444"
        opacity="0.5"
      />

      {/* Ruler markings - horizontal */}
      {Array.from({ length: Math.ceil(canvasWidth / 50) }).map((_, i) => {
        const x = i * 50;
        return (
          <g key={`h-${i}`}>
            <line
              x1={x}
              y1={marginTop - 5}
              x2={x}
              y2={marginTop - 2}
              stroke="#9ca3af"
              strokeWidth="1"
              opacity="0.5"
            />
            {i % 2 === 0 && (
              <text
                x={x}
                y={marginTop - 8}
                fontSize="8"
                fill="#9ca3af"
                textAnchor="middle"
                opacity="0.5"
              >
                {x}
              </text>
            )}
          </g>
        );
      })}

      {/* Ruler markings - vertical */}
      {Array.from({ length: Math.ceil(canvasHeight / 50) }).map((_, i) => {
        const y = i * 50;
        return (
          <g key={`v-${i}`}>
            <line
              x1={marginLeft - 5}
              y1={y}
              x2={marginLeft - 2}
              y2={y}
              stroke="#9ca3af"
              strokeWidth="1"
              opacity="0.5"
            />
            {i % 2 === 0 && (
              <text
                x={marginLeft - 8}
                y={y + 3}
                fontSize="8"
                fill="#9ca3af"
                textAnchor="end"
                opacity="0.5"
              >
                {y}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
