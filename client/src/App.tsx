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
      x: 50, y: 50, width: 200, height: 50, zIndex: prev.length + 1, opacity: 1, visible: true
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
    <div className="h-screen w-screen flex flex-col bg-[#121212] overflow-hidden text-white font-sans">
      <input type="file" ref={htmInputRef} accept=".htm,.html" style={{ display: 'none' }} onChange={(e) => {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = () => { if(reader.result) window.open(URL.createObjectURL(new Blob([reader.result], { type: 'text/html' })), '_blank'); };
        reader.readAsText(file); e.target.value = '';
      }} />
      <input type="file" ref={pdfInputRef} accept=".pdf" style={{ display: 'none' }} onChange={handlePdfChange} />
      <input type="file" ref={imageInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
      
      <Toolbar onLoadPdf={handleLoadPdf} onAddText={addTextLayer} onAddImage={handleAddImage} onOpenHtm={handleOpenHtm} />

      <div className="flex flex-1 overflow-hidden">
        
        {/* BLOCO 1: Preview com fundo quadriculado */}
        <div className="flex-1 p-6 flex items-center justify-center bg-grid overflow-auto">
          <Canvas 
            pdfUrl={pdfUrl} layers={layers} selectedLayerId={selectedLayerId} 
            setSelectedLayerId={setSelectedLayerId}
            onUpdateLayer={(id, props) => setLayers(prev => prev.map(l => l.id === id ? { ...l, ...props } : l))}
          />
        </div>
        
        {/* BLOCO 2 & 3: Sidebars Direitas Escuras */}
        <div className="w-80 bg-[#1e1e1e] border-l border-[#333] flex flex-col shadow-2xl">
          
          <div className="h-1/2 border-b border-[#333] flex flex-col">
            <LayerPanel 
              layers={layers} selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId} onDeleteLayer={deleteLayer}
              onMoveLayer={moveLayer} onToggleVisibility={toggleVisibility}
            />
          </div>

          <div className="h-1/2 flex flex-col">
            <LayerProperties 
              selectedLayer={selectedLayer}
              onUpdateLayer={updateSelectedLayer}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
