import { useState, useRef, useCallback } from 'react'
import { usePdfProcessor } from './hooks/usePdfProcessor'
import { PdfCanvas } from './components/PdfCanvas'
import { LayerProperties } from './components/LayerProperties'
import type { Layer } from './types'

function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfDoc, setPdfDoc] = useState<ArrayBuffer | null>(null)
  const [layers, setLayers] = useState<Layer[]>([])
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const htmInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  
  const { generatePDF, loadPDF } = usePdfProcessor()

  // Handle PDF upload
  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const arrayBuffer = await loadPDF(file)
      setPdfDoc(arrayBuffer)
      
      // Create URL for preview
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
      
      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error loading PDF:', error)
      alert('Erro ao carregar PDF')
    }
  }

  // Handle HTM file open
  const handleOpenHtm = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    
    reader.onload = (e) => {
      const textoLido = e.target?.result as string
      
      // Cria um Blob HTML e gera uma URL temporária
      const blob = new Blob([textoLido], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      // Abre em nova aba
      window.open(url, '_blank')
      
      // Limpa o input para permitir reabrir o mesmo arquivo se necessário
      if (htmInputRef.current) {
        htmInputRef.current.value = ''
      }
    }

    reader.readAsText(file)
  }, [])

  // Handle adding text layer
  const handleAddText = useCallback(() => {
    const newLayer: Layer = {
      id: `text-${Date.now()}`,
      type: 'text',
      name: 'Texto',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 50 },
      rotation: 0,
      zIndex: layers.length + 1,
      visible: true,
      locked: false,
      content: 'Novo Texto',
      applyToAllPages: false,
      pageScope: 'last',
    }
    setLayers(prev => [...prev, newLayer])
    setSelectedLayerId(newLayer.id)
  }, [layers.length])

  // Handle adding image layer
  const handleAddImage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const newLayer: Layer = {
        id: `image-${Date.now()}`,
        type: 'image',
        name: file.name,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
        rotation: 0,
        zIndex: layers.length + 1,
        visible: true,
        locked: false,
        content,
        applyToAllPages: false,
        pageScope: 'last',
      }
      setLayers(prev => [...prev, newLayer])
      setSelectedLayerId(newLayer.id)
      
      if (imageInputRef.current) {
        imageInputRef.current.value = ''
      }
    }
    reader.readAsDataURL(file)
  }, [layers.length])

  // Handle generating PDF
  const handleGeneratePdf = useCallback(async () => {
    if (!pdfDoc) {
      alert('Carregue um PDF primeiro')
      return
    }

    try {
      const pdfBuffer = await generatePDF(layers, pdfDoc)
      
      // Download the generated PDF
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'documento-editado.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Erro ao gerar PDF')
    }
  }, [pdfDoc, layers, generatePDF])

  // Remove layer
  const handleRemoveLayer = useCallback((layerId: string) => {
    setLayers(prev => prev.filter(l => l.id !== layerId))
    if (selectedLayerId === layerId) {
      setSelectedLayerId(null)
    }
  }, [selectedLayerId])

  // Update layer
  const handleUpdateLayer = useCallback((layerId: string, updates: Partial<Layer>) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, ...updates } : l))
  }, [])

  // Reorder layers (change zIndex)
  const handleReorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    setLayers(prev => {
      const newLayers = [...prev]
      const [removed] = newLayers.splice(fromIndex, 1)
      newLayers.splice(toIndex, 0, removed)
      // Update zIndex based on new order
      return newLayers.map((layer, index) => ({ ...layer, zIndex: index + 1 }))
    })
  }, [])

  // Toggle layer visibility
  const handleToggleVisibility = useCallback((layerId: string) => {
    setLayers(prev => prev.map(l => 
      l.id === layerId ? { ...l, visible: !l.visible } : l
    ))
  }, [])

  const selectedLayer = layers.find(l => l.id === selectedLayerId)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white shadow-md p-4 flex gap-2 items-center">
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={handlePdfUpload}
        />
        <input
          type="file"
          ref={htmInputRef}
          accept=".htm,.html"
          style={{ display: 'none' }}
          onChange={handleOpenHtm}
        />
        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAddImage}
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Carregar PDF
        </button>
        <button
          onClick={handleAddText}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Adicionar Texto
        </button>
        <button
          onClick={() => imageInputRef.current?.click()}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Adicionar Imagem
        </button>
        <button
          onClick={() => htmInputRef.current?.click()}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
        >
          Abrir Análise HTM
        </button>
        <button
          onClick={handleGeneratePdf}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Gerar PDF
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative bg-gray-200 overflow-auto p-8">
          {pdfUrl ? (
            <PdfCanvas
              pdfUrl={pdfUrl}
              layers={layers}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              onUpdateLayer={handleUpdateLayer}
              onRemoveLayer={handleRemoveLayer}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Carregue um PDF para começar</p>
            </div>
          )}
        </div>

        {/* Side Panel - Layer List */}
        <div className="w-64 bg-white shadow-lg border-l p-4 overflow-y-auto">
          <h3 className="font-bold mb-4 text-gray-700">Camadas</h3>
          {layers.length === 0 ? (
            <p className="text-gray-400 text-sm">Nenhuma camada</p>
          ) : (
            <div className="space-y-2">
              {[...layers].sort((a, b) => b.zIndex - a.zIndex).map((layer, index) => (
                <div
                  key={layer.id}
                  className={`p-3 rounded border cursor-pointer transition ${
                    selectedLayerId === layer.id
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedLayerId(layer.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{layer.name}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleVisibility(layer.id)
                        }}
                        className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        {layer.visible ? '👁' : '🚫'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveLayer(layer.id)
                        }}
                        className="text-xs px-2 py-1 bg-red-200 rounded hover:bg-red-300"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {layer.type} • Z: {layer.zIndex}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Layer Properties Panel */}
      {selectedLayer && (
        <LayerProperties
          layer={selectedLayer}
          onUpdate={(updates) => handleUpdateLayer(selectedLayer.id, updates)}
        />
      )}
    </div>
  )
}

export default App