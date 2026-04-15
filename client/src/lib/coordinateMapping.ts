/**
 * Coordinate Mapping Utilities
 * Convert between screen pixels (px) and PDF points (pt)
 * 1 inch = 72 points = 96 pixels (at 96 DPI)
 */

import { CoordinateMapping, Position, Size } from '@/types';

const DPI = 96;
const POINTS_PER_INCH = 72;
const PIXELS_PER_INCH = 96;
const POINTS_TO_PIXELS = PIXELS_PER_INCH / POINTS_PER_INCH; // ~1.33

/**
 * Create coordinate mapping for a PDF page
 * @param canvasWidth - Canvas width in pixels
 * @param canvasHeight - Canvas height in pixels
 * @param pageWidth - PDF page width in points
 * @param pageHeight - PDF page height in points
 */
export const createCoordinateMapping = (
  canvasWidth: number,
  canvasHeight: number,
  pageWidth: number = 612, // Letter width in points (8.5")
  pageHeight: number = 792 // Letter height in points (11")
): CoordinateMapping => {
  const screenToPageRatio = Math.min(
    canvasWidth / pageWidth,
    canvasHeight / pageHeight
  );

  return {
    screenToPageRatio,
    screenToPointRatio: screenToPageRatio / POINTS_TO_PIXELS,
    canvasWidth,
    canvasHeight,
    pageWidth,
    pageHeight,
  };
};

/**
 * Convert screen pixels to PDF points
 */
export const pixelToPoints = (
  pixels: number,
  mapping: CoordinateMapping
): number => {
  return pixels / (mapping.screenToPageRatio * POINTS_TO_PIXELS);
};

/**
 * Convert PDF points to screen pixels
 */
export const pointsToPixels = (
  points: number,
  mapping: CoordinateMapping
): number => {
  return points * mapping.screenToPageRatio * POINTS_TO_PIXELS;
};

/**
 * Convert screen position to PDF position
 */
export const screenPositionToPdfPosition = (
  screenPos: Position,
  mapping: CoordinateMapping
): Position => {
  return {
    x: pixelToPoints(screenPos.x, mapping),
    y: pixelToPoints(screenPos.y, mapping),
  };
};

/**
 * Convert PDF position to screen position
 */
export const pdfPositionToScreenPosition = (
  pdfPos: Position,
  mapping: CoordinateMapping
): Position => {
  return {
    x: pointsToPixels(pdfPos.x, mapping),
    y: pointsToPixels(pdfPos.y, mapping),
  };
};

/**
 * Convert screen size to PDF size
 */
export const screenSizeToPdfSize = (
  screenSize: Size,
  mapping: CoordinateMapping
): Size => {
  return {
    width: pixelToPoints(screenSize.width, mapping),
    height: pixelToPoints(screenSize.height, mapping),
  };
};

/**
 * Convert PDF size to screen size
 */
export const pdfSizeToScreenSize = (
  pdfSize: Size,
  mapping: CoordinateMapping
): Size => {
  return {
    width: pointsToPixels(pdfSize.width, mapping),
    height: pointsToPixels(pdfSize.height, mapping),
  };
};

/**
 * Calculate snap guides for alignment
 * Returns positions where elements should snap
 */
export const calculateSnapGuides = (
  canvasWidth: number,
  canvasHeight: number,
  snapDistance: number = 10
): { vertical: number[]; horizontal: number[] } => {
  return {
    vertical: [
      0,
      canvasWidth / 4,
      canvasWidth / 2,
      (canvasWidth * 3) / 4,
      canvasWidth,
    ],
    horizontal: [
      0,
      canvasHeight / 4,
      canvasHeight / 2,
      (canvasHeight * 3) / 4,
      canvasHeight,
    ],
  };
};

/**
 * Check if position should snap to guide
 */
export const getSnapPosition = (
  position: number,
  guides: number[],
  snapDistance: number = 10
): { snapped: boolean; position: number } => {
  for (const guide of guides) {
    if (Math.abs(position - guide) < snapDistance) {
      return { snapped: true, position: guide };
    }
  }
  return { snapped: false, position };
};

/**
 * Standard PDF page sizes in points
 */
export const PDF_PAGE_SIZES = {
  LETTER: { width: 612, height: 792 }, // 8.5" x 11"
  LEGAL: { width: 612, height: 1008 }, // 8.5" x 14"
  A4: { width: 595, height: 842 }, // 210mm x 297mm
  A3: { width: 842, height: 1191 }, // 297mm x 420mm
  TABLOID: { width: 792, height: 1224 }, // 11" x 17"
};
