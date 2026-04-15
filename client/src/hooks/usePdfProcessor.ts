/**
 * usePdfProcessor Hook
 * Handles PDF generation and manipulation using pdf-lib
 * Memoized to prevent unnecessary re-renders
 */

import { useCallback, useMemo } from 'react';
import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import type { Layer, TextLayer } from '@/types';

interface UsePdfProcessorReturn {
  generatePDF: (
    layers: Layer[],
    pdfBuffer?: ArrayBuffer
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
      pdfBuffer?: ArrayBuffer
    ): Promise<ArrayBuffer> => {
      let pdfDoc: PDFDocument;

      if (pdfBuffer) {
        // Load existing PDF
        pdfDoc = await PDFDocument.load(pdfBuffer);
      } else {
        // Create new PDF
        pdfDoc = await PDFDocument.create();
        pdfDoc.addPage([612, 792]); // Letter size
      }

      const pages = pdfDoc.getPages();
      const pageCount = pages.length;

      // Sort layers by zIndex
      const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

      // Process each layer
      for (const layer of sortedLayers) {
        if (!layer.visible) continue;

        // Determine which pages to apply the layer to
        let pagesToApply: PDFPage[] = [];
        
        if (layer.pageScope === 'all') {
          pagesToApply = pages;
        } else if (layer.pageScope === 'last') {
          pagesToApply = [pages[pages.length - 1]];
        } else if (layer.pageNumber !== undefined && pages[layer.pageNumber]) {
          pagesToApply = [pages[layer.pageNumber]];
        } else {
          pagesToApply = [pages[pages.length - 1]]; // Default to last page
        }

        for (const page of pagesToApply) {
          if (!page) continue;

          if (layer.type === 'text') {
            await addTextLayer(page, layer as TextLayer, pdfDoc);
          } else if (layer.type === 'image' || layer.type === 'logo' || layer.type === 'background') {
            await addImageLayer(page, layer, pdfDoc);
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      return pdfBytes.buffer as ArrayBuffer;
    },
    []
  );

  // Add text layer to PDF page
  const addTextLayer = useCallback(
    async (page: PDFPage, layer: TextLayer, pdfDoc: PDFDocument) => {
      const { width: pageWidth, height: pageHeight } = page.getSize();
      
      // Convert pixels to points (assuming 96 DPI screen, 72 DPI PDF)
      const pxToPt = 72 / 96;
      
      // Calculate position (PDF coordinates start from bottom-left)
      const x = layer.position.x * pxToPt;
      const y = pageHeight - (layer.position.y * pxToPt) - (layer.size.height * pxToPt);

      // Embed font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page.drawText(layer.content, {
        x,
        y,
        size: (layer.fontSize || 12) * pxToPt,
        font,
        color: hexToRgb(layer.color || '#000000'),
        maxWidth: layer.size.width * pxToPt,
        lineHeight: (layer.lineHeight || 1.2) * (layer.fontSize || 12) * pxToPt,
      });
    },
    []
  );

  // Add image layer to PDF page
  const addImageLayer = useCallback(
    async (page: PDFPage, layer: Layer, pdfDoc: PDFDocument) => {
      const { width: pageWidth, height: pageHeight } = page.getSize();
      
      // Convert pixels to points
      const pxToPt = 72 / 96;

      try {
        // Check if content is base64 or URL
        let imageData: Uint8Array;
        
        if (layer.content.startsWith('data:image/')) {
          // Base64 image
          const base64Data = layer.content.split(',')[1];
          imageData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        } else {
          // Skip external URLs for now
          console.log('Skipping external image URL:', layer.content);
          return;
        }

        // Embed image based on type
        let image;
        if (layer.content.includes('image/png')) {
          image = await pdfDoc.embedPng(imageData);
        } else if (layer.content.includes('image/jpeg') || layer.content.includes('image/jpg')) {
          image = await pdfDoc.embedJpg(imageData);
        } else {
          console.log('Unsupported image format:', layer.name);
          return;
        }

        // Calculate position (PDF coordinates start from bottom-left)
        const x = layer.position.x * pxToPt;
        const y = pageHeight - (layer.position.y * pxToPt) - (layer.size.height * pxToPt);
        const width = layer.size.width * pxToPt;
        const height = layer.size.height * pxToPt;

        page.drawImage(image, {
          x,
          y,
          width,
          height,
          opacity: (layer.adjustments?.opacity ?? 100) / 100,
        });
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
