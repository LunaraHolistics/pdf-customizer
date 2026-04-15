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

  // Estilo das bolinhas de redimensionamento
  const handleBaseStyle = {
    width: 12,
    height: 12,
    background: '#3b82f6',
    border: '2px solid #fff',
    borderRadius: '50%',
    boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
  };

  return (
    <div style={{ width: '595px', height: '842px', position: 'relative', backgroundColor: 'white' }}>
      
      {pdfUrl && (
        <iframe 
          src={pdfUrl} 
          title="PDF Preview"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', zIndex: 0, pointerEvents: 'none' }} 
        />
      )}

      {layers.map((layer) => {
        if (layer.visible === false) return null;

        return (
          <Rnd
            key={layer.id}
            size={{ width: layer.width, height: layer.height }}
            position={{ x: layer.x, y: layer.y }}
            enableResizing={true}
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
            {/* DIV PURA COM ESTILO INLINE PARA NÃO BRIGAR COM O REACT-RND */}
            <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {layer.type === 'text' ? (
                <textarea 
                  value={layer.content} 
                  style={{ width: '100%', height: '100%', resize: 'none', border: 'none', outline: 'none', background: 'transparent', textAlign: 'center' }}
                  onChange={(e) => onUpdateLayer(layer.id, { content: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <img 
                  src={layer.content} 
                  alt
