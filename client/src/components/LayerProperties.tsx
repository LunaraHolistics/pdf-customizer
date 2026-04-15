import type { Layer } from '../App';

interface LayerPropertiesProps {
  selectedLayer: Layer | null;
  onUpdateLayer: (props: Partial<Layer>) => void;
}

export default function LayerProperties({ selectedLayer, onUpdateLayer }: LayerPropertiesProps) {
  if (!selectedLayer) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4 text-center">
        <span className="text-4xl mb-3 opacity-30">🖌️</span>
        <p className="text-xs leading-relaxed">Selecione uma camada para ver suas propriedades</p>
      </div>
    );
  }

  const Slider = ({ label, value, min, max, step, onChange }: { label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void }) => (
    <div className="mb-4">
      <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
        <span>{label}</span>
        <span className="text-blue-400 font-mono">{Math.round(value)}%</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-[#444] rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );

  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto bg-[#1e1e1e]">
      <h3 className="font-bold text-xs text-gray-400 mb-4 border-b border-[#333] pb-2 uppercase tracking-wider">
        Propriedades
      </h3>

      <Slider label="Opacidade" value={selectedLayer.opacity * 100} min={0} max={100} step={1} onChange={(v) => onUpdateLayer({ opacity: v / 100 })} />
      
      {selectedLayer.type === 'image' && (
        <>
          <Slider label="Brilho" value={selectedLayer.brightness || 100} min={0} max={200} step={1} onChange={(v) => onUpdateLayer({ brightness: v })} />
          <Slider label="Contraste" value={selectedLayer.contrast || 100} min={0} max={200} step={1} onChange={(v) => onUpdateLayer({ contrast: v })} />
          <Slider label="Saturação" value={selectedLayer.saturate || 100} min={0} max={200} step={1} onChange={(v) => onUpdateLayer({ saturate: v })} />
        </>
      )}
      
      <div className="mt-auto pt-4 border-t border-[#333] space-y-1">
        <p className="text-[10px] text-gray-600 font-mono">X: {Math.round(selectedLayer.x)} | Y: {Math.round(selectedLayer.y)}</p>
        <p className="text-[10px] text-gray-600 font-mono">W: {Math.round(selectedLayer.width)} | H: {Math.round(selectedLayer.height)}</p>
      </div>
    </div>
  );
}
