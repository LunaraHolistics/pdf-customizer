/**
 * TextEditPanel Component
 * Controls for editing text layer properties
 */

import React from 'react';
import { TextLayer } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface TextEditPanelProps {
  layer: TextLayer | null;
  onTextChange: (text: string) => void;
  onPropertyChange: (key: string, value: any) => void;
}

export const TextEditPanel: React.FC<TextEditPanelProps> = ({
  layer,
  onTextChange,
  onPropertyChange,
}) => {
  if (!layer || layer.type !== 'text') {
    return (
      <div className="p-4 text-gray-500 text-sm">
        Selecione um texto para editar
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 bg-white border-l border-gray-200">
      <h3 className="font-semibold text-gray-900">Editar Texto</h3>

      {/* Text content */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Conteúdo</label>
        <textarea
          value={layer.content}
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          placeholder="Digite o texto aqui..."
        />
      </div>

      {/* Font size */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Tamanho da Fonte: {layer.fontSize}px
        </label>
        <Slider
          value={[layer.fontSize]}
          onValueChange={(value) => onPropertyChange('fontSize', value[0])}
          min={8}
          max={72}
          step={1}
          className="w-full"
        />
      </div>

      {/* Font family */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Fonte</label>
        <Select value={layer.fontFamily} onValueChange={(value) => onPropertyChange('fontFamily', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Font weight */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Peso da Fonte</label>
        <Select value={layer.fontWeight} onValueChange={(value) => onPropertyChange('fontWeight', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="bold">Negrito</SelectItem>
            <SelectItem value="lighter">Leve</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Text align */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Alinhamento</label>
        <Select value={layer.textAlign} onValueChange={(value) => onPropertyChange('textAlign', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Esquerda</SelectItem>
            <SelectItem value="center">Centro</SelectItem>
            <SelectItem value="right">Direita</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Color */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Cor</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={layer.color}
            onChange={(e) => onPropertyChange('color', e.target.value)}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <Input
            type="text"
            value={layer.color}
            onChange={(e) => onPropertyChange('color', e.target.value)}
            placeholder="#000000"
            className="flex-1"
          />
        </div>
      </div>

      {/* Line height */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Altura da Linha: {layer.lineHeight}
        </label>
        <Slider
          value={[layer.lineHeight]}
          onValueChange={(value) => onPropertyChange('lineHeight', value[0])}
          min={1}
          max={3}
          step={0.1}
          className="w-full"
        />
      </div>
    </div>
  );
};
