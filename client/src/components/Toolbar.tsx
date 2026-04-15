/**
 * Toolbar Component
 * Main toolbar with actions for adding elements, clearing, and generating PDF
 */

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Type,
  Image,
  Trash2,
  Download,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ToolbarProps {
  onAddText: () => void;
  onAddImage: () => void;
  onClearAll: () => void;
  onGeneratePDF: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  pdfFileName?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onAddText,
  onAddImage,
  onClearAll,
  onGeneratePDF,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  pdfFileName = 'documento.pdf',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddImage();
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-white border-b border-gray-200 overflow-x-auto">
      {/* Add elements */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="sm" className="gap-2">
            <Plus size={16} />
            Adicionar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onAddText} className="gap-2 cursor-pointer">
            <Type size={16} />
            Texto
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAddImage} className="gap-2 cursor-pointer">
            <Image size={16} />
            Imagem
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Undo/Redo */}
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        title="Desfazer"
      >
        ↶
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        title="Refazer"
      >
        ↷
      </Button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Clear */}
      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 size={16} />
        Limpar Tudo
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Generate PDF */}
      <Button
        variant="default"
        size="sm"
        onClick={onGeneratePDF}
        className="gap-2 bg-green-600 hover:bg-green-700"
      >
        <Download size={16} />
        Gerar PDF
      </Button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};
