import { Rnd } from 'react-rnd';
import type { Layer } from '../App';

interface CanvasProps {
  pdfUrl: string | null;
  layers: Layer[];
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
  onUpdateLayer: (id: string, props: Partial<Layer>) => void;
}

export default function Canvas({ pdfUrl, layers, selectedLayerId, setSelectedLayerId, onUpdateLayer }: CanvasProps) {
  return (
    <div className="relative bg-white shadow-lg" style={{ width: '595px', height: '842px' }}>
      
      {/* REGRA MAIS IMPORTANTE: O PDF FICA ABAIXO E NÃO BLOQUEIA CLIQUES */}
      {pdfUrl && (
        <img 
          src={pdfUrl} 
          alt="PDF Preview" 
          className="absolute top-0 left-0 w-full h-full object-contain"
          style={{ zIndex: 0, pointerEvents: 'none' }} 
        />
      )}

      {/* CAMADAS ARRUMÁVEIS POR CIMA DO PDF */}
      {layers.map((layer) => (
        <Rnd
          key={layer.id}
          size={{ width: layer.width, height: layer.height }}
          position={{ x: layer.x, y: layer.y }}
          onDragStop={(e, d) => onUpdateLayer(layer.id, { x: d.x, y: d.y })}
          onResizeStop={(e, direction, ref, delta, position) => {
            onUpdateLayer(layer.id, {
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
              ...position,
            });
          }}
          style={{ 
            zIndex: layer.zIndex, // Z-INDEX DINÂMICO
            opacity: layer.opacity,
            border: selectedLayerId === layer.id ? '2px solid blue' : '1px dashed gray'
          }}
          onClick={() => setSelectedLayerId(layer.id)}
        >
          <div className="w-full h-full flex items-center justify-center text-sm p-2 overflow-hidden">
            {layer.type === 'text' ? layer.content : <img src={layer.content} alt="img" className="w-full h-full object-contain" />}
          </div>
        </Rnd>
      ))}
      
      {!pdfUrl && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Carregue um PDF para começar
        </div>
      )}
    </div>
  );
}
