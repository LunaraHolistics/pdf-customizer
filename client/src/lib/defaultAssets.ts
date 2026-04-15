/**
 * Default Assets Configuration
 * Mock database with pre-loaded assets for PDF customizer
 */

import { DefaultAssets } from '@/types';

// Placeholder SVG logos and backgrounds as base64
const DEFAULT_LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#f0f0f0" rx="10"/>
  <circle cx="100" cy="100" r="80" fill="#4f46e5"/>
  <text x="100" y="120" font-size="48" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">PDF</text>
</svg>
`;

const DEFAULT_BG_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bgGradient)"/>
  <circle cx="1100" cy="100" r="150" fill="#4f46e5" opacity="0.1"/>
  <circle cx="100" cy="700" r="200" fill="#4f46e5" opacity="0.1"/>
</svg>
`;

// Convert SVG to base64
const svgToBase64 = (svg: string): string => {
  const encoded = btoa(unescape(encodeURIComponent(svg.trim())));
  return `data:image/svg+xml;base64,${encoded}`;
};

export const defaultAssets: DefaultAssets = {
  defaultLogo: svgToBase64(DEFAULT_LOGO_SVG),
  defaultBg: svgToBase64(DEFAULT_BG_SVG),
  defaultHeaderText: 'Documento Personalizado',
  defaultFooterText: '© 2026 - Todos os direitos reservados',
};

// Mock database of pre-loaded assets
export const mockAssetDatabase = {
  logos: [
    {
      id: 'logo-default',
      name: 'Logo Padrão',
      url: defaultAssets.defaultLogo,
      category: 'default',
    },
  ],
  backgrounds: [
    {
      id: 'bg-default',
      name: 'Fundo Padrão',
      url: defaultAssets.defaultBg,
      category: 'default',
    },
  ],
  templates: [
    {
      id: 'template-standard',
      name: 'Template Padrão',
      description: 'Template padrão com logo, cabeçalho e rodapé',
      layers: [],
    },
  ],
};

// Utility function to load image as base64
export const loadImageAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Utility function to get image dimensions
export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
};
