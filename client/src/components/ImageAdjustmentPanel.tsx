/**
 * ImageAdjustmentPanel Component
 * Controls for adjusting image properties (brightness, contrast, saturation, opacity)
 */

import React from 'react';
import { Layer, ImageAdjustments } from '@/types';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface ImageAdjustmentPanelProps {
  layer: Layer | null;
  onAdjustmentChange: (adjustments: ImageAdjustments) => void;
  onReset: () => void;
}

export const ImageAdjustmentPanel: React.FC<ImageAdjustmentPanelProps> = ({
  layer,
  onAdjustmentChange,
  onReset,
}) => {
  if (!layer || (layer.type !== 'image' && layer.type !== 'logo' && layer.type !== 'background')) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        Selecione uma imagem para ajustar
      </div>
    );
  }

  const adjustments = layer.adjustments || {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    opacity: 100,
    hueRotate: 0,
  };

  const handleAdjustmentChange = (key: keyof ImageAdjustments, value: number) => {
    onAdjustmentChange({
      ...adjustments,
      [key]: value,
    });
  };

  return (
    <div className="p-4 space-y-4 bg-white border-l border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Ajustes de Imagem</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={onReset}
          className="gap-1"
        >
          <RotateCcw size={14} />
          Resetar
        </Button>
      </div>

      {/* Brightness */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Brilho: {adjustments.brightness > 0 ? '+' : ''}{adjustments.brightness}%
        </label>
        <Slider
          value={[adjustments.brightness]}
          onValueChange={(value) => handleAdjustmentChange('brightness', value[0])}
          min={-100}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Contrast */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Contraste: {adjustments.contrast > 0 ? '+' : ''}{adjustments.contrast}%
        </label>
        <Slider
          value={[adjustments.contrast]}
          onValueChange={(value) => handleAdjustmentChange('contrast', value[0])}
          min={-100}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Saturation */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Saturação: {adjustments.saturation > 0 ? '+' : ''}{adjustments.saturation}%
        </label>
        <Slider
          value={[adjustments.saturation]}
          onValueChange={(value) => handleAdjustmentChange('saturation', value[0])}
          min={-100}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Hue Rotate */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Rotação de Matiz: {adjustments.hueRotate}°
        </label>
        <Slider
          value={[adjustments.hueRotate]}
          onValueChange={(value) => handleAdjustmentChange('hueRotate', value[0])}
          min={0}
          max={360}
          step={1}
          className="w-full"
        />
      </div>

      {/* Opacity */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Opacidade: {adjustments.opacity}%
        </label>
        <Slider
          value={[adjustments.opacity]}
          onValueChange={(value) => handleAdjustmentChange('opacity', value[0])}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Info */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 Dica: Use opacidade baixa para criar efeito de marca d&apos;água
        </p>
      </div>
    </div>
  );
};
