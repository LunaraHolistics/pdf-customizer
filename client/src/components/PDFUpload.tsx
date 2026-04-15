/**
 * PDFUpload Component
 * Handles PDF file upload and loading
 */

import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PDFUploadProps {
  onFileLoaded: (buffer: ArrayBuffer, fileName: string) => void;
  onFileRemoved?: () => void;
  fileName?: string;
}

export const PDFUpload: React.FC<PDFUploadProps> = ({
  onFileLoaded,
  onFileRemoved,
  fileName,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      toast.error('Por favor, selecione um arquivo PDF');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result;
      if (buffer instanceof ArrayBuffer) {
        onFileLoaded(buffer, file.name);
        toast.success('PDF carregado com sucesso');
      }
    };
    reader.onerror = () => {
      toast.error('Erro ao carregar arquivo');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileRemoved?.();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {fileName ? (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-900 truncate max-w-xs">
            {fileName}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemove}
            className="p-0 h-auto"
          >
            <X size={14} />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          className="gap-2"
        >
          <Upload size={16} />
          Carregar PDF
        </Button>
      )}
    </div>
  );
};
