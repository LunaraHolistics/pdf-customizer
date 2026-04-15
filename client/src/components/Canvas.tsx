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
  
  const getFilterStyle = (layer: Layer) => {
    const brightness = layer.brightness || 100;
    const contrast = layer.contrast || 100;
    const saturate = layer.saturate || 100;
    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
  };

  // A SOLUÇÃO: Estilo injetado diretamente nas bolinhas de redimensionamento
  const handleBaseStyle = {
    width: 12,
    height: 12,
    background: '#3b82f6',
    border: '2px solid #fff',
    borderRadius: '50%',
    boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
  };

  return (
    <div className="relative bg-white" style={{ width: '595px', height: '842px' }}>
      
      {pdfUrl && (
        <iframe 
          src={pdfUrl} 
          title="PDF Preview"
          className="absolute top-0 left-0"
          style={{ width: '100%', height: '100%', border: 'none', zIndex: 0, pointerEvents: 'none' }} 
        />
      )}

      {layers.map((layer) => {
        if (layer.visible === false) return null;

        return (
          <Rnd
            key={layer.id}
            size={{ width: layer.width, height: layer.height }}
            position={{ x: layer.x, y: layer.y }}
            enableResizing={true} // Garantia de que está ligado
            resizeHandleStyles={{
              topRight: handleBaseStyle,
              bottomRight: handleBaseStyle,
              bottomLeft: handleBaseStyle,
              topLeft: handleBaseStyle,
            }}
            onDragStop={(e, d) => onUpdateLayer(layer.id, { x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, position) => {
              onUpdateLayer(layer.id, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                ...position,
              });
            }}
            style={{ 
              zIndex: layer.zIndex, 
              opacity: layer.opacity,
              filter: getFilterStyle(layer),
              border: selectedLayerId === layer.id ? '2px solid #3b82f6' : '1px dashed #a0aec0',
              background: layer.type === 'text' ? 'rgba(255,255,255,0.95)' : 'transparent'
            }}
            onClick={() => setSelectedLayerId(layer.id)}
          >
            <div className="w-full h-full flex items-center justify-center text-sm p-2 overflow-hidden">
              {layer.type === 'text' ? (
                <textarea 
                  value={layer.content} 
                  className="w-full h-full resize-none focus:outline-none bg-transparent text-center"
                  onChange={(e) => onUpdateLayer(layer.id, { content: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <img src={layer.content} alt="img" className="w-full h-full object-contain pointer-events-none" draggable={false} />
              )}
            </div>
          </Rnd>
        );
      })}
      
      {!pdfUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
          <span className="text-6xl mb-4 opacity-20">📄</span>
          <p className="font-medium">Carregue um PDF para começar</p>
          <p className="text-xs text-gray-400 mt-1">Suporta arquivos .pdf padrão</p>
        </div>
      )}
    </div>
  );
}
