import { useState, useRef } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import LayerPanel from './components/LayerPanel';

export interface Layer {
  id: string;
  type: 'text' | 'image';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  opacity: number;
}

export default function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  
  const htmInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleOpenHtm = () => htmInputRef.current?.click();
  
  const handleLoadPdf = () => pdfInputRef.current?.click();
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfUrl(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleAddImage = () => imageInputRef.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const newLayer: Layer = {
          id: Date.now().toString(),
          type: 'image',
          content: reader.result as string, // Base64 da imagem
          x: 100, y: 100,
          width: 200, height: 200,
          zIndex: layers.length + 1,
          opacity: 1,
        };
        setLayers([...layers, newLayer]);
      }
    };
    reader.readAsDataURL(file); // Lê como URL (Base64)
    e.target.value = '';
  };

  const addTextLayer = () => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      type: 'text',
      content: 'Novo Texto',
      x: 50, y: 50,
      width: 200, height: 50,
      zIndex: layers.length + 1,
      opacity: 1,
    };
    setLayers([...layers, newLayer]);
  };

  const deleteLayer = (id: string) => {
    setLayers(layers.filter(l => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Inputs Ocultos */}
      <input type="file" ref={htmInputRef} accept=".htm,.html" style={{ display: 'none' }} onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => { if(reader.result) { window.open(URL.createObjectURL(new Blob([reader.result], { type: 'text/html' })), '_blank'); } };
        reader.readAsText(file);
        e.target.value = '';
      }} />

      <input type="file" ref={pdfInputRef} accept=".pdf" style={{ display: 'none' }} onChange={handlePdfChange} />
      
      <input type="file" ref={imageInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
      
      <Toolbar 
        onLoadPdf={handleLoadPdf} 
        onAddText={addTextLayer}
        onAddImage={handleAddImage}
        onOpenHtm={handleOpenHtm} 
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 flex items-center justify-center bg-gray-200 overflow-auto">
          <Canvas 
            pdfUrl={pdfUrl} 
            layers={layers} 
            selectedLayerId={selectedLayerId} 
            setSelectedLayerId={setSelectedLayerId}
            onUpdateLayer={(id, newProps) => {
              setLayers(layers.map(l => l.id === id ? { ...l, ...newProps } : l));
            }}
          />
        </div>
        
        <LayerPanel 
          layers={layers} 
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onDeleteLayer={deleteLayer}
        />
      </div>
    </div>
  );
}
