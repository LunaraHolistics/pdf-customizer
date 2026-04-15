import type { Layer } from '../App';

interface LayerPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onDeleteLayer: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
  onToggleVisibility: (id: string) => void;
}

export default function LayerPanel({ layers, selectedLayerId, onSelectLayer, onDeleteLayer, onMoveLayer, onToggleVisibility }: LayerPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-sm text-gray-700">Camadas</h3>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white">
        {layers.map((layer, index) => (
          <div 
            key={layer.id}
            onClick={() => onSelectLayer(layer.id)}
            className={`px-3 py-2.5 flex items-center gap-2 cursor-pointer transition-colors ${
              selectedLayerId === layer.id ? 'bg-blue-50 border-l-2 border-l-blue-600' : 'hover:bg-gray-50'
            }`}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }}
              className="text-gray-400 hover:text-gray-600 text-xs"
            >
              {layer.visible !== false ? '👁️' : '🚫'}
            </button>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{layer.name || (layer.type === 'text' ? 'Texto' : 'Imagem')}</p>
            </div>

            <div className="flex items-center gap-0.5 text-gray-400">
              <button onClick={(e) => { e.stopPropagation(); onMoveLayer(layer.id, 'up'); }} disabled={index === 0} className="hover:text-gray-700 disabled:opacity-30 p-0.5">▲</button>
              <button onClick={(e) => { e.stopPropagation(); onMoveLayer(layer.id, 'down'); }} disabled={index === layers.length - 1} className="hover:text-gray-700 disabled:opacity-30 p-0.5">▼</button>
              <button onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id); }} className="hover:text-red-600 p-0.5">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
