import type { Layer } from '../App';

interface LayerPropertiesProps {
  selectedLayer: Layer | null;
  onUpdateLayer: (props: Partial<Layer>) => void;
}

export default function LayerProperties({ selectedLayer, onUpdateLayer }: LayerPropertiesProps) {
  if (!selectedLayer) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
        <span className="text-4xl mb-2">🖌️</span>
        <p className="text-sm">Selecione uma camada para editar suas propriedades</p>
      </div>
    );
  }

  const Slider = ({ label, value, min, max, step, onChange }: { label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <input 
        type="range" 
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );

  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto">
      <h3 className="font-bold text-sm mb-4 text-gray-700 border-b pb-2">
        Editando: {selectedLayer.name || selectedLayer.type}
      </h3>

      <Slider 
        label="Opacidade (Marca d'água)" 
        value={selectedLayer.opacity * 100} 
        min={0} max={100} step={1} 
        onChange={(v) => onUpdateLayer({ opacity: v / 100 })} 
      />
      
      {selectedLayer.type === 'image' && (
        <>
          <Slider 
            label="Brilho" 
            value={selectedLayer.brightness || 100} 
            min={0} max={200} step={1} 
            onChange={(v) => onUpdateLayer({ brightness: v })} 
          />
          <Slider 
            label="Contraste" 
            value={selectedLayer.contrast || 100} 
            min={0} max={200} step={1} 
            onChange={(v) => onUpdateLayer({ contrast: v })} 
          />
          <Slider 
            label="Saturação" 
            value={selectedLayer.saturate || 100} 
            min={0} max={200} step={1} 
            onChange={(v) => onUpdateLayer({ saturate: v })} 
          />
        </>
      )}
      
      <div className="mt-auto pt-4 border-t">
        <p className="text-xs text-gray-400">Posição X: {Math.round(selectedLayer.x)} | Y: {Math.round(selectedLayer.y)}</p>
        <p className="text-xs text-gray-400">Tamanho: {Math.round(selectedLayer.width)}x{Math.round(selectedLayer.height)}</p>
      </div>
    </div>
  );
}
