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
      <div className="p-3 border-b border-[#333] bg-[#252525] flex justify-between items-center">
        <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Camadas</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 bg-[#1e1e1e]">
        {layers.map((layer, index) => (
          <div 
            key={layer.id}
            onClick={() => onSelectLayer(layer.id)}
            className={`p-2 rounded cursor-pointer flex items-center gap-2 text-xs transition-colors ${
              selectedLayerId === layer.id 
                ? 'bg-blue-600/20 border border-blue-500/50 text-white' 
                : 'border border-transparent text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200'
            }`}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }}
              className="text-sm w-5 text-center opacity-60 hover:opacity-100"
            >
              {layer.visible !== false ? '👁️' : '🚫'}
            </button>
            
            <div className="flex-1 truncate">
              {layer.name || (layer.type === 'text' ? '✏️ Texto' : '🖼️ Imagem')}
            </div>

            <div className="flex gap-0.5">
              <button onClick={(e) => { e.stopPropagation(); onMoveLayer(layer.id, 'up'); }} disabled={index === 0} className="disabled:opacity-20 hover:bg-[#444] p-0.5 rounded text-[10px]">▲</button>
              <button onClick={(e) => { e.stopPropagation(); onMoveLayer(layer.id, 'down'); }} disabled={index === layers.length - 1} className="disabled:opacity-20 hover:bg-[#444] p-0.5 rounded text-[10px]">▼</button>
              <button onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id); }} className="text-red-400 hover:bg-red-500/20 p-0.5 rounded text-[10px]">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
