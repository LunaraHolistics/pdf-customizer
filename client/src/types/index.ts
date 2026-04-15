/**
 * PDF Customizer Types and Interfaces
 * Core data structures for layer management, PDF processing, and state management
 */

export type LayerType = 'image' | 'text' | 'logo' | 'background' | 'pdf';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ImageAdjustments {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  opacity: number; // 0 to 100
  hueRotate: number; // 0 to 360
}

export interface Layer {
  id: string;
  type: LayerType;
  name: string;
  position: Position;
  size: Size;
  rotation: number; // 0 to 360
  zIndex: number;
  visible: boolean;
  locked: boolean;
  content: string; // URL, base64, or text content
  adjustments?: ImageAdjustments;
  applyToAllPages?: boolean; // For images/elements
  pageNumber?: number; // Specific page if not all pages
  pageScope?: 'all' | 'last'; // Scope of page application
  isDeletable?: boolean; // Whether this layer can be deleted (false for PDF background)
}

export interface TextLayer extends Layer {
  type: 'text';
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold' | 'lighter';
  color: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
}

export interface PDFProject {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  pdfFile?: File | string; // Original PDF file or URL
  layers: Layer[];
  canvasWidth: number;
  canvasHeight: number;
  pdfPageCount: number;
  currentPageIndex: number;
}

export interface DefaultAssets {
  defaultLogo: string; // Base64 or URL
  defaultBg: string; // Base64 or URL
  defaultHeaderText: string;
  defaultFooterText: string;
}

export interface CoordinateMapping {
  screenToPageRatio: number;
  screenToPointRatio: number;
  canvasWidth: number;
  canvasHeight: number;
  pageWidth: number;
  pageHeight: number;
}

export interface SnapGuide {
  type: 'vertical' | 'horizontal';
  position: number;
  visible: boolean;
}

export interface SelectionState {
  selectedLayerId: string | null;
  selectedLayers: string[];
  isMultiSelect: boolean;
}

export interface PersistenceState {
  projectId: string;
  layers: Layer[];
  currentPageIndex: number;
  lastSaved: Date;
}
