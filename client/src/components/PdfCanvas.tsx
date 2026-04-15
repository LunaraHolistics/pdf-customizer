import { useEffect, useRef, useState } from 'react'
import { Rnd } from 'react-rnd'
import * as pdfjsLib from 'pdfjs-dist'
import type { Layer } from '@/types'

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

interface PdfCanvasProps {
  pdfUrl: string
  layers: Layer[]
  selectedLayerId: string | null
  onSelectLayer: (id: string | null) => void
  onUpdateLayer: (id: string, updates: Partial<Layer>) => void
  onRemoveLayer: (id: string) => void
}

export function PdfCanvas({
  pdfUrl,
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
}: PdfCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  // Render PDF to canvas
  useEffect(() => {
    const renderPdf = async () => {
      if (!pdfUrl || !canvasRef.current) return

      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl)
        const pdf = await loadingTask.promise
        
        // Get first page for preview
        const page = await pdf.getPage(1)
        
        // Calculate scale to fit container
        const viewport = page.getViewport({ scale: 1 })
        const container = containerRef.current
        if (!container) return

        const containerWidth = container.clientWidth || 800
        const scale = containerWidth / viewport.width
        
        const scaledViewport = page.getViewport({ scale })
        
        // Set canvas size
        const canvas = canvasRef.current
        canvas.width = scaledViewport.width
        canvas.height = scaledViewport.height

        // Render page using the canvas element directly
        const renderContext = {
          canvasContext: canvas.getContext('2d')! as unknown as CanvasRenderingContext2D,
          viewport: scaledViewport,
        } as any
        await page.render(renderContext).promise
      } catch (error) {
        console.error('Error rendering PDF:', error)
      }
    }

    renderPdf()
  }, [pdfUrl])

  // Update container size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Generate CSS filter from adjustments
  const getFilterStyle = (layer: Layer): string => {
    if (!layer.adjustments) return ''
    
    const { brightness = 100, contrast = 100, saturation = 100 } = layer.adjustments
    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
  }

  return (
    <div 
      ref={containerRef}
      className="relative mx-auto"
      style={{ 
        width: containerSize.width > 0 ? Math.min(containerSize.width, 800) : 800,
        minHeight: 600,
      }}
    >
      {/* PDF Canvas - MUST have these inline styles to not block clicks */}
      <canvas
        ref={canvasRef}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 0, 
          pointerEvents: 'none' 
        }}
      />

      {/* Layers using react-rnd */}
      {layers.map((layer) => (
        <Rnd
          key={layer.id}
          bounds="parent"
          position={{ x: layer.position.x, y: layer.position.y }}
          size={{ width: layer.size.width, height: layer.size.height }}
          zIndex={layer.zIndex}
          disableDragging={!layer.visible || layer.locked}
          enableResizing={layer.visible && !layer.locked}
          onDragStop={(_, data) => {
            onUpdateLayer(layer.id, {
              position: { x: data.x, y: data.y },
            })
          }}
          onResizeStop={(_, __, ref, delta, position) => {
            onUpdateLayer(layer.id, {
              size: {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
              },
              position: { x: position.x, y: position.y },
            })
          }}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            onSelectLayer(layer.id)
          }}
          style={{ 
            zIndex: layer.zIndex,
            opacity: layer.visible ? (layer.adjustments?.opacity ?? 100) / 100 : 0,
            pointerEvents: layer.visible && !layer.locked ? 'auto' : 'none',
          }}
          className={`group ${selectedLayerId === layer.id ? 'ring-2 ring-blue-500' : ''}`}
        >
          {/* Layer content */}
          <div 
            className="w-full h-full relative"
            style={{ 
              filter: getFilterStyle(layer),
            }}
          >
            {layer.type === 'image' && (
              <img
                src={layer.content}
                alt={layer.name}
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
              />
            )}
            {layer.type === 'text' && (
              <div 
                className="w-full h-full p-2 overflow-hidden text-sm bg-white/50 border border-dashed border-gray-400"
                style={{ 
                  color: (layer as any).color || '#000000',
                  fontSize: (layer as any).fontSize || 12,
                }}
              >
                {layer.content}
              </div>
            )}
          </div>

          {/* Selection indicator */}
          {selectedLayerId === layer.id && (
            <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none">
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full" />
            </div>
          )}
        </Rnd>
      ))}
    </div>
  )
}
