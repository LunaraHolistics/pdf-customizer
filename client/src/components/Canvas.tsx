import { Rnd } from 'react-rnd';
import type { Layer } from '../App';

export default function Canvas({ pdfUrl, layers, selectedLayerId, setSelectedLayerId, onUpdateLayer }: any) {
  const handleBaseStyle = { width: 12, height: 12, background: '#3b82f6', border: '2px solid #fff', borderRadius: '50%', boxShadow: '0 2px 6px rgba(0,0,0,0.5)' };
  const getFilterStyle = (layer: any) => `brightness(${layer.brightness || 100}%) contrast(${layer.contrast || 100}%) saturate(${layer.saturate || 100}%)`;

  return (
    <div style={{ width: '595px', height: '842px', position: 'relative', backgroundColor: 'white' }}>
      
      {pdfUrl && (
        <iframe src={pdfUrl} title="PDF Preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', zIndex: 0, pointerEvents: 'none' }} />
      )}

      {layers.map((layer: any) => {
        if (layer.visible === false) return null;
        return (
          <Rnd
            key={layer.id}
            size={{ width: layer.width, height: layer.height }}
            position={{ x: layer.x, y: layer.y }}
            enableResizing={true}
            resizeHandleStyles={{ topRight: handleBaseStyle, bottomRight: handleBaseStyle, bottomLeft: handleBaseStyle, topLeft: handleBaseStyle }}
            onDragStop={(e: any, d: any) => onUpdateLayer(layer.id, { x: d.x, y: d.y })}
            onResizeStop={(e: any, dir: any, ref: any, delta: any, pos: any) => onUpdateLayer(layer.id, { width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...pos })}
            style={{ zIndex: layer.zIndex, opacity: layer.opacity, filter: getFilterStyle(layer), border: selectedLayerId === layer.id ? '2px solid #3b82f6' : '1px dashed #a0aec0', background: layer.type === 'text' ? 'rgba(255,255,255,0.95)' : 'transparent' }}
            onClick={() => setSelectedLayerId(layer.id)}
          >
            <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {layer.type === 'text' ? (
                <textarea value={layer.content} style={{ width: '100%', height: '100%', resize: 'none', border: 'none', outline: 'none', background: 'transparent', textAlign: 'center' }} onChange={(e: any) => onUpdateLayer(layer.id, { content: e.target.value })} onClick={(e: any) => e.stopPropagation()} />
              ) : (
                <img src={layer.content} alt="img" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} draggable={false} />
              )}
            </div>
          </Rnd>
        );
      })}
      
      {!pdfUrl && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6b7280', backgroundColor: '#f9fafb' }}>
          <span style={{ fontSize: '60px', marginBottom: '16px', opacity: 0.2 }}>📄</span>
          <p style={{ fontWeight: '500' }}>Carregue um PDF para começar</p>
        </div>
      )}
    </div>
  );
}
