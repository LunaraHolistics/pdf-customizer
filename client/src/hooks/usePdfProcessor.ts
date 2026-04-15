/**
 * usePdfProcessor Hook
 * Handles PDF generation and manipulation using pdf-lib
 * Memoized to prevent unnecessary re-renders
 */

import { useCallback, useMemo } from 'react';
import { PDFDocument, PDFPage, rgb, degrees } from 'pdf-lib';
import { Layer, TextLayer, CoordinateMapping } from '@/types';
import {
  pixelToPoints,
  screenSizeToPdfSize,
} from '@/lib/coordinateMapping';

interface UsePdfProcessorReturn {
  generatePDF: (
    layers: Layer[],
    pdfFile?: ArrayBuffer,
    mapping?: CoordinateMapping
  ) => Promise<ArrayBuffer>;
  loadPDF: (file: File) => Promise<ArrayBuffer>;
  getPDFPageCount: (pdfBuffer: ArrayBuffer) => Promise<number>;
  getPDFPageSize: (pdfBuffer: ArrayBuffer, pageIndex?: number) => Promise<{ width: number; height: number }>;
}

export const usePdfProcessor = (): UsePdfProcessorReturn => {
  // Generate PDF with layers
  const generatePDF = useCallback(
    async (
      layers: Layer[],
      pdfFile?: ArrayBuffer,
      mapping?: CoordinateMapping
    ): Promise<ArrayBuffer> => {
      let pdfDoc: PDFDocument;

      if (pdfFile) {
        // Load existing PDF
        pdfDoc = await PDFDocument.load(pdfFile);
      } else {
        // Create new PDF
        pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([612, 792]); // Letter size
      }

      const pages = pdfDoc.getPages();

      // Sort layers by zIndex
      const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

      // Process each layer
      for (const layer of sortedLayers) {
        if (!layer.visible) continue;

        const pagesToApply = layer.applyToAllPages
          ? pages
          : layer.pageNumber !== undefined
            ? [pages[layer.pageNumber]]
            : [pages[pages.length - 1]];

        for (const page of pagesToApply) {
          if (!page) continue;

          if (layer.type === 'text') {
            await addTextLayer(page, layer as TextLayer, mapping);
          } else if (layer.type === 'image' || layer.type === 'logo' || layer.type === 'background') {
            await addImageLayer(page, layer, mapping);
          }
        }
      }

      return await pdfDoc.save();
    },
    []
  );

  // Add text layer to PDF page
  const addTextLayer = useCallback(
    async (page: PDFPage, layer: TextLayer, mapping?: CoordinateMapping) => {
      const { width, height } = page.getSize();

      let x = layer.position.x;
      let y = height - layer.position.y - layer.size.height;

      if (mapping) {
        x = pixelToPoints(layer.position.x, mapping);
        y = height - pixelToPoints(layer.position.y + layer.size.height, mapping);
      }

      page.drawText(layer.content, {
        x,
        y,
        size: layer.fontSize,
        font: undefined, // Use default font
        color: hexToRgb(layer.color),
        maxWidth: layer.size.width,
        lineHeight: layer.lineHeight,
      });
    },
    []
  );

  // Add image layer to PDF page
  const addImageLayer = useCallback(
    async (page: PDFPage, layer: Layer, mapping?: CoordinateMapping) => {
      const { width, height } = page.getSize();

      try {
        // For now, we'll skip image embedding in PDF
        // In production, use proper image embedding with pdfjs or canvas
        console.log('Image layer processing:', layer.name);
      } catch (error) {
        console.error('Error adding image layer:', error);
      }
    },
    []
  );

  // Load PDF file
  const loadPDF = useCallback(async (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result instanceof ArrayBuffer) {
          resolve(result);
        } else {
          reject(new Error('Failed to read PDF file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  }, []);

  // Get PDF page count
  const getPDFPageCount = useCallback(async (pdfBuffer: ArrayBuffer): Promise<number> => {
    try {
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      return pdfDoc.getPageCount();
    } catch (error) {
      console.error('Error getting page count:', error);
      return 0;
    }
  }, []);

  // Get PDF page size
  const getPDFPageSize = useCallback(
    async (pdfBuffer: ArrayBuffer, pageIndex: number = 0): Promise<{ width: number; height: number }> => {
      try {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pages = pdfDoc.getPages();
        if (pages[pageIndex]) {
          const { width, height } = pages[pageIndex].getSize();
          return { width, height };
        }
        return { width: 612, height: 792 };
      } catch (error) {
        console.error('Error getting page size:', error);
        return { width: 612, height: 792 };
      }
    },
    []
  );

  return useMemo(
    () => ({
      generatePDF,
      loadPDF,
      getPDFPageCount,
      getPDFPageSize,
    }),
    [generatePDF, loadPDF, getPDFPageCount, getPDFPageSize]
  );
};

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return rgb(
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    );
  }
  return rgb(0, 0, 0);
};
