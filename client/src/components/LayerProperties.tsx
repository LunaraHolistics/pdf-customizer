import type { Layer } from '@/types'

interface LayerPropertiesProps {
  layer: Layer
  onUpdate: (updates: Partial<Layer>) => void
}

export function LayerProperties({ layer, onUpdate }: LayerPropertiesProps) {
  const adjustments = layer.adjustments || {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    opacity: 100,
    hueRotate: 0,
  }

  return (
    <div className="bg-white border-t shadow-lg p-4 w-full max-w-md mx-auto">
      <h3 className="font-bold text-gray-700 mb-4">Propriedades da Camada</h3>
      
      <div className="space-y-4">
        {/* Opacity */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Opacidade: {Math.round(adjustments.opacity)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={adjustments.opacity}
            onChange={(e) =>
              onUpdate({
                adjustments: { ...adjustments, opacity: parseInt(e.target.value) },
              })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Brightness */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Brilho: {adjustments.brightness}%
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={adjustments.brightness}
            onChange={(e) =>
              onUpdate({
                adjustments: { ...adjustments, brightness: parseInt(e.target.value) },
              })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Contrast */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Contraste: {adjustments.contrast}%
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={adjustments.contrast}
            onChange={(e) =>
              onUpdate({
                adjustments: { ...adjustments, contrast: parseInt(e.target.value) },
              })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Saturation */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Saturação: {adjustments.saturation}%
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={adjustments.saturation}
            onChange={(e) =>
              onUpdate({
                adjustments: { ...adjustments, saturation: parseInt(e.target.value) },
              })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Page Scope */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Escopo da Página
          </label>
          <select
            value={layer.pageScope || 'last'}
            onChange={(e) =>
              onUpdate({ pageScope: e.target.value as 'all' | 'last' })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="last">Apenas na última página</option>
            <option value="all">Todas as páginas</option>
          </select>
        </div>

        {/* Position Info */}
        <div className="grid grid-cols-2 gap-2 pt-4 border-t">
          <div>
            <label className="block text-xs text-gray-500">X</label>
            <span className="text-sm font-mono">{Math.round(layer.position.x)}px</span>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Y</label>
            <span className="text-sm font-mono">{Math.round(layer.position.y)}px</span>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Largura</label>
            <span className="text-sm font-mono">{Math.round(layer.size.width)}px</span>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Altura</label>
            <span className="text-sm font-mono">{Math.round(layer.size.height)}px</span>
          </div>
        </div>
      </div>
    </div>
  )
}
