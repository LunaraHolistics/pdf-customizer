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
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-sm text-gray-700">Camadas</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {layers.map((layer, index) => (
          <div 
            key={layer.id}
            onClick={() => onSelectLayer(layer.id)}
            className={`p-2 rounded border cursor-pointer flex items-center gap-2 text-xs ${selectedLayerId === layer.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }}
              className="text-sm w-5 text-center"
              title="Ocultar/Mostrar"
            >
              {layer.visible !== false ? '👁️' : '🚫'}
            </button>
            
            <div className="flex-1 truncate font-medium">
              {layer.name || (layer.type === 'text' ? '✏️ Texto' : '🖼️ Imagem')}
            </div>

            <div className="flex gap-1">
              <button 
                onClick={(e) => { e.stopPropagation(); onMoveLayer(layer.id, 'up'); }}
                disabled={index === 0}
                className="disabled:opacity-30 hover:bg-gray-200 p-0.5 rounded"
                title="Mover para cima"
              >▲</button>
              <button 
                onClick={(e) => { e.stopPropagation(); onMoveLayer(layer.id, 'down'); }}
                disabled={index === layers.length - 1}
                className="disabled:opacity-30 hover:bg-gray-200 p-0.5 rounded"
                title="Mover para baixo"
              >▼</button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id); }}
                className="text-red-500 hover:bg-red-50 p-0.5 rounded"
                title="Excluir"
              >🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
