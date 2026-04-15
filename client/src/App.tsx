import { useState, useRef } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import LayerPanel from './components/LayerPanel';
import LayerProperties from './components/LayerProperties';

export interface Layer {
  id: string;
  type: 'text' | 'image';
  name?: string;
  content: string;
  x: number; y: number;
  width: number; height: number;
  zIndex: number;
  opacity: number;
  visible?: boolean;
  brightness?: number;
  contrast?: number;
  saturate?: number;
  fontSize?: number;
  color?: string;
  textAlign?: string;
}

export default function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  
  const htmInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const selectedLayer = layers.find(l => l.id === selectedLayerId) || null;

  const handleOpenHtm = () => htmInputRef.current?.click();
  const handleLoadPdf = () => pdfInputRef.current?.click();
  
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPdfUrl(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleAddImage = () => imageInputRef.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setLayers(prev => [...prev, {
          id: Date.now().toString(), type: 'image', name: file.name, content: reader.result as string,
          x: 100, y: 100, width: 200, height: 200, zIndex: prev.length + 1, opacity: 1, visible: true, brightness: 100, contrast: 100, saturate: 100
        }]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addTextLayer = () => {
    setLayers(prev => [...prev, {
      id: Date.now().toString(), type: 'text', name: 'Texto', content: 'Novo Texto',
      x: 150, y: 30, width: 300, height: 60, zIndex: prev.length + 1, opacity: 1, visible: true,
      fontSize: 24, color: '#1f2937', textAlign: 'center'
    }]);
  };

  const deleteLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const toggleVisibility = (id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: l.visible === false ? true : false } : l));
  };

  const moveLayer = (id: string, direction: 'up' | 'down') => {
    setLayers(prev => {
      const index = prev.findIndex(l => l.id === id);
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === prev.length - 1)) return prev;
      const newLayers = [...prev];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newLayers[index], newLayers[swapIndex]] = [newLayers[swapIndex], newLayers[index]];
      return newLayers.map((l, i) => ({ ...l, zIndex: i + 1 }));
    });
  };

  const updateSelectedLayer = (props: Partial<Layer>) => {
    if (!selectedLayerId) return;
    setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, ...props } : l));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Inputs Ocultos */}
      <input type="file" ref={htmInputRef} accept=".htm,.html" style={{ display: 'none' }} onChange={(e) => {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = () => { if(reader.result) window.open(URL.createObjectURL(new Blob([reader.result], { type: 'text/html' })), '_blank'); };
        reader.readAsText(file); e.target.value = '';
      }} />
      <input type="file" ref={pdfInputRef} accept=".pdf" style={{ display: 'none' }} onChange={handlePdfChange} />
      <input type="file" ref={imageInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
      
      {/* CABEÇALHO IGUAL REFERÊNCIA */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PDF Customizer PWA</h1>
          <p className="text-sm text-gray-500">Personalize seus documentos PDF com facilidade</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div> Online
          </div>
          <button onClick={handleOpenHtm} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium shadow-sm">
            Abrir HTM
          </button>
        </div>
      </div>

      {/* BARRA DE FERRAMENTAS (UPLOAD E BOTÕES) */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
        <button onClick={handleLoadPdf} className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium">
          📄 Carregar PDF
        </button>
        <Toolbar onAddText={addTextLayer} onAddImage={handleAddImage} />
      </div>

      {/* CORPO COM 3 COLUNAS EXATAS */}
      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        
        {/* COLUNA 1: Preview (Expandido) */}
        <div className="flex-1 bg-grid rounded-lg border border-gray-200 p-6 flex items-center justify-center overflow-auto shadow-inner max-w-4xl">
          <Canvas 
            pdfUrl={pdfUrl} layers={layers} selectedLayerId={selectedLayerId} 
            setSelectedLayerId={setSelectedLayerId}
            onUpdateLayer={(id, props) => setLayers(prev => prev.map(l => l.id === id ? { ...l, ...props } : l))}
          />
        </div>
        
        {/* COLUNA 2: Lista de Camadas (Larga) */}
        <div className="w-56 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex-shrink-0">
          <LayerPanel 
            layers={layers} selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId} onDeleteLayer={deleteLayer}
            onMoveLayer={moveLayer} onToggleVisibility={toggleVisibility}
          />
        </div>

        {/* COLUNA 3: Propriedades da Camada (Larga e Rolável) */}
        <div className="w-72 flex flex-col overflow-y-auto gap-4 flex-shrink-0">
          <LayerProperties 
            selectedLayer={selectedLayer}
            onUpdateLayer={updateSelectedLayer}
          />
        </div>

      </div>

      {/* RODAPÉ SIMPLES */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 text-center text-sm text-gray-500">
        ©2026 - PDF Customizer PWA. Todos os direitos reservados.
      </div>
    </div>
  );
}
