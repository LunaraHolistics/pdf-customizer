import type { Layer } from '../App';

interface LayerPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onDeleteLayer: (id: string) => void;
}

export default function LayerPanel({ layers, selectedLayerId, onSelectLayer, onDeleteLayer }: LayerPanelProps) {
  return (
    <div className="w-64 bg-white border-l border-gray-300 p-4 overflow-y-auto">
      <h3 className="font-bold mb-4">Camadas</h3>
      <div className="flex flex-col gap-2">
        {layers.map((layer, index) => (
          <div 
            key={layer.id}
            onClick={() => onSelectLayer(layer.id)}
            className={`p-2 rounded border cursor-pointer flex justify-between items-center ${selectedLayerId === layer.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          >
            <span className="text-sm truncate">
              {layer.type === 'text' ? '✏️ Texto' : '🖼️ Imagem'} (z: {index + 1})
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id); }}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
