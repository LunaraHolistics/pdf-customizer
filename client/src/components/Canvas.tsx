/**
 * Canvas Component
 * Main editing area for PDF customization with draggable/resizable layers
 */

import React, { useRef, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { Layer, SnapGuide, Position } from '@/types';
import { useImageAdjustments } from '@/hooks/useImageAdjustments';
import { calculateSnapGuides, getSnapPosition } from '@/lib/coordinateMapping';
import { PrintMarginGuides } from '@/components/PrintMarginGuides';
import { Eye, EyeOff, Lock, Unlock, X } from 'lucide-react';

interface CanvasProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onLayerSelect: (id: string | null) => void;
  onLayerUpdate: (id: string, updates: Partial<Layer>) => void;
  onLayerDelete: (id: string) => void;
  canvasWidth: number;
  canvasHeight: number;
  snapDistance?: number;
}

export const Canvas: React.FC<CanvasProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  onLayerUpdate,
  onLayerDelete,
  canvasWidth,
  canvasHeight,
  snapDistance = 10,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { getFilterString } = useImageAdjustments();
  const [snapGuides, setSnapGuides] = useState<{ vertical: number[]; horizontal: number[] }>({
    vertical: [],
    horizontal: [],
  });
  const [visibleGuides, setVisibleGuides] = useState<SnapGuide[]>([]);

  useEffect(() => {
    const guides = calculateSnapGuides(canvasWidth, canvasHeight, snapDistance);
    setSnapGuides(guides);
  }, [canvasWidth, canvasHeight, snapDistance]);

  const handleDragStop = (id: string, d: { x: number; y: number }) => {
    const { snapped: snappedX, position: newX } = getSnapPosition(d.x, snapGuides.vertical, snapDistance);
    const { snapped: snappedY, position: newY } = getSnapPosition(d.y, snapGuides.horizontal, snapDistance);

    if (snappedX || snappedY) {
      setVisibleGuides([
        ...(snappedX ? [{ type: 'vertical' as const, position: newX, visible: true }] : []),
        ...(snappedY ? [{ type: 'horizontal' as const, position: newY, visible: true }] : []),
      ]);

      setTimeout(() => setVisibleGuides([]), 300);
    }

    onLayerUpdate(id, {
      position: { x: newX, y: newY },
    });
  };

  const handleResizeStop = (
    id: string,
    _direction: any,
    _ref: any,
    _delta: any,
    position: Position
  ) => {
    onLayerUpdate(id, {
      position,
      size: {
        width: _ref.offsetWidth,
        height: _ref.offsetHeight,
      },
    });
  };

  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);
  const pdfLayer = layers.find((l) => l.type === 'pdf');

  return (
    <div
      ref={canvasRef}
      className="relative bg-white border-2 border-gray-300 overflow-hidden"
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
      onClick={() => onLayerSelect(null)}
    >
      {/* Print margins and guides */}
      <PrintMarginGuides
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        marginTop={20}
        marginRight={20}
        marginBottom={20}
        marginLeft={20}
        showGrid={true}
        gridSize={50}
      />

      {/* PDF Background Layer */}
      {pdfLayer && pdfLayer.visible && (
        <div
          className="absolute w-full h-full"
          style={{
            zIndex: pdfLayer.zIndex,
            opacity: (pdfLayer.adjustments?.opacity ?? 100) / 100,
          }}
        >
          <img
            src={pdfLayer.content}
            alt="PDF Background"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      )}

      {/* Snap guides */}
      {visibleGuides.map((guide, idx) => (
        <div
          key={`guide-${idx}`}
          className={`absolute pointer-events-none ${
            guide.type === 'vertical' ? 'w-px bg-blue-500' : 'h-px bg-blue-500'
          }`}
          style={
            guide.type === 'vertical'
              ? {
                  left: guide.position,
                  top: 0,
                  height: '100%',
                  opacity: 0.5,
                  zIndex: 100,
                }
              : {
                  top: guide.position,
                  left: 0,
                  width: '100%',
                  opacity: 0.5,
                  zIndex: 100,
                }
          }
        />
      ))}

      {/* Layers */}
      {sortedLayers.map((layer) => {
        if (!layer.visible || layer.type === 'pdf') return null;

        const isSelected = selectedLayerId === layer.id;
        const filterString = layer.adjustments ? getFilterString(layer.adjustments) : '';

        return (
          <Rnd
            key={layer.id}
            default={{
              x: layer.position.x,
              y: layer.position.y,
              width: layer.size.width,
              height: layer.size.height,
            }}
            onDragStop={(_e, d) => handleDragStop(layer.id, d)}
            onResizeStop={(_e, direction, ref, delta, position) =>
              handleResizeStop(layer.id, direction, ref, delta, position)
            }
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onLayerSelect(layer.id);
            }}
            disableDragging={layer.locked}
            enableResizing={!layer.locked}
            className={`${
              isSelected
                ? 'ring-2 ring-blue-500 ring-offset-0'
                : 'hover:ring-1 hover:ring-gray-400'
            } cursor-move transition-all`}
            style={{
              zIndex: layer.zIndex + 10,
            }}
          >
            <div
              className="w-full h-full relative group"
              style={{
                filter: filterString,
                opacity: (layer.adjustments?.opacity ?? 100) / 100,
              }}
            >
              {/* Layer content */}
              {layer.type === 'text' ? (
                <div
                  className="w-full h-full flex items-center justify-center p-2 text-center break-words"
                  style={{
                    color: (layer as any).color || '#000000',
                    fontSize: (layer as any).fontSize || 14,
                    fontFamily: (layer as any).fontFamily || 'Arial',
                    fontWeight: (layer as any).fontWeight || 'normal',
                    lineHeight: (layer as any).lineHeight || 1.5,
                  }}
                >
                  {layer.content}
                </div>
              ) : (
                <img
                  src={layer.content}
                  alt={layer.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              )}

              {/* Layer controls */}
              {isSelected && (
                <div className="absolute -top-8 left-0 right-0 flex gap-1 bg-gray-800 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerUpdate(layer.id, { visible: !layer.visible });
                    }}
                    className="p-1 hover:bg-gray-700 rounded"
                    title={layer.visible ? 'Ocultar' : 'Mostrar'}
                  >
                    {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerUpdate(layer.id, { locked: !layer.locked });
                    }}
                    className="p-1 hover:bg-gray-700 rounded"
                    title={layer.locked ? 'Desbloquear' : 'Bloquear'}
                  >
                    {layer.locked ? <Lock size={16} /> : <Unlock size={16} />}
                  </button>
                  {layer.isDeletable !== false && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerDelete(layer.id);
                      }}
                      className="p-1 hover:bg-red-600 rounded ml-auto"
                      title="Deletar"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </Rnd>
        );
      })}
    </div>
  );
};
