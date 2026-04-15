/**
 * PDF Generator Utility
 * Advanced PDF generation with proper image and text handling
 */

import { PDFDocument, PDFPage, rgb, degrees } from 'pdf-lib';
import { Layer, TextLayer, CoordinateMapping } from '@/types';
import { pixelToPoints, screenSizeToPdfSize } from '@/lib/coordinateMapping';

/**
 * Generate PDF from layers
 */
export const generatePDFFromLayers = async (
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
    pdfDoc.addPage([612, 792]); // Letter size
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
        await addTextLayerToPDF(page, layer as TextLayer, mapping);
      } else if (
        layer.type === 'image' ||
        layer.type === 'logo' ||
        layer.type === 'background'
      ) {
        await addImageLayerToPDF(page, layer, mapping);
      }
    }
  }

  return await pdfDoc.save();
};

/**
 * Add text layer to PDF page
 */
const addTextLayerToPDF = async (
  page: PDFPage,
  layer: TextLayer,
  mapping?: CoordinateMapping
) => {
  const { width, height } = page.getSize();

  let x = layer.position.x;
  let y = height - layer.position.y - layer.size.height;
  let fontSize = layer.fontSize;

  if (mapping) {
    x = pixelToPoints(layer.position.x, mapping);
    y = height - pixelToPoints(layer.position.y + layer.size.height, mapping);
    fontSize = layer.fontSize * (mapping.screenToPageRatio / 1.33);
  }

  const textColor = hexToRgb(layer.color);

  try {
    page.drawText(layer.content, {
      x,
      y,
      size: fontSize,
      color: textColor,
      maxWidth: layer.size.width,
      lineHeight: layer.lineHeight * fontSize,
    });
  } catch (error) {
    console.error('Error adding text layer:', error);
  }
};

/**
 * Add image layer to PDF page
 */
const addImageLayerToPDF = async (
  page: PDFPage,
  layer: Layer,
  mapping?: CoordinateMapping
) => {
  const { width, height } = page.getSize();

  try {
    // Load image data
    let imageData: ArrayBuffer | undefined;

    if (layer.content.startsWith('data:')) {
      // Base64 image
      const base64 = layer.content.split(',')[1];
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      imageData = bytes.buffer;
    } else if (layer.content.startsWith('http')) {
      // URL - fetch and convert
      const response = await fetch(layer.content);
      imageData = await response.arrayBuffer();
    }

    if (!imageData) return;

    // Determine image type
    let image;
    if (layer.content.includes('png') || layer.content.startsWith('data:image/png')) {
      image = await PDFDocument.load(imageData).then((doc) =>
        doc.embedPng(imageData as ArrayBuffer)
      );
    } else if (layer.content.includes('jpg') || layer.content.startsWith('data:image/jpeg')) {
      image = await PDFDocument.load(imageData).then((doc) =>
        doc.embedJpg(imageData as ArrayBuffer)
      );
    } else {
      // Try generic embedding
      return;
    }

    let x = layer.position.x;
    let y = height - layer.position.y - layer.size.height;
    let imgWidth = layer.size.width;
    let imgHeight = layer.size.height;

    if (mapping) {
      x = pixelToPoints(layer.position.x, mapping);
      y = height - pixelToPoints(layer.position.y + layer.size.height, mapping);
      const pdfSize = screenSizeToPdfSize(layer.size, mapping);
      imgWidth = pdfSize.width;
      imgHeight = pdfSize.height;
    }

    // Apply opacity/transparency
    const opacity = layer.adjustments?.opacity ?? 100;

    page.drawImage(image, {
      x,
      y,
      width: imgWidth,
      height: imgHeight,
      opacity: opacity / 100,
      rotate: degrees(layer.rotation),
    });
  } catch (error) {
    console.error('Error adding image layer:', error);
  }
};

/**
 * Convert hex color to RGB
 */
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

/**
 * Download PDF as blob
 */
export const downloadPDF = (pdfBuffer: ArrayBuffer, fileName: string = 'documento.pdf') => {
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
