import type { Layer } from '../App';

interface LayerPropertiesProps {
  selectedLayer: Layer | null;
  onUpdateLayer: (props: Partial<Layer>) => void;
}

export default function LayerProperties({ selectedLayer, onUpdateLayer }: LayerPropertiesProps) {
  if (!selectedLayer) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-400 shadow-sm h-full flex flex-col items-center justify-center">
        <p className="text-sm">Selecione uma camada para editar</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      
      {/* PAINEL DE TEXTO (Aparece só se for texto) */}
      {selectedLayer.type === 'text' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-3 border-b pb-2">Edição de Texto</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Conteúdo</label>
              <textarea 
                value={selectedLayer.content}
                onChange={(e) => onUpdateLayer({ content: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 resize-none h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-500">Tamanho (px)</label>
                <input 
                  type="number" value={selectedLayer.fontSize || 16}
                  onChange={(e) => onUpdateLayer({ fontSize: parseInt(e.target.value) })}
                  className="w-full mt-1 p-1.5 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Cor</label>
                <div className="flex mt-1 gap-1">
                  <input 
                    type="color" value={selectedLayer.color || '#000000'}
                    onChange={(e) => onUpdateLayer({ color: e.target.value })}
                    className="w-8 h-8 p-0.5 border border-gray-300 rounded cursor-pointer"
                  />
                  <input 
                    type="text" value={selectedLayer.color || '#000000'}
                    onChange={(e) => onUpdateLayer({ color: e.target.value })}
                    className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Alinhamento</label>
              <div className="flex gap-1">
                {['left', 'center', 'right'].map((align) => (
                  <button 
                    key={align}
                    onClick={() => onUpdateLayer({ textAlign: align })}
                    className={`flex-1 py-1.5 text-xs font-medium border rounded ${
                      selectedLayer.textAlign === align ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {align === 'left' ? 'Esquerda' : align === 'center' ? 'Centro' : 'Direita'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAINEL DE IMAGEM (Aparece se for imagem) */}
      {selectedLayer.type === 'image' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h4 className="font-semibold text-sm text-gray-700">Ajustes de Imagem</h4>
            <button 
              onClick={() => onUpdateLayer({ brightness: 100, contrast: 100, saturate: 100, opacity: 1 })}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Resetar
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Opacidade</span>
                <span className="font-medium">{Math.round((selectedLayer.opacity || 1) * 100)}%</span>
              </div>
              <input type="range" min="0" max="100" value={(selectedLayer.opacity || 1) * 100} onChange={(e) => onUpdateLayer({ opacity: parseInt(e.target.value) / 100 })} className="w-full accent-blue-600" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Brilho</span>
                <span className="font-medium">{selectedLayer.brightness || 100}%</span>
              </div>
              <input type="range" min="0" max="200" value={selectedLayer.brightness || 100} onChange={(e) => onUpdateLayer({ brightness: parseInt(e.target.value) })} className="w-full accent-blue-600" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Contraste</span>
                <span className="font-medium">{selectedLayer.contrast || 100}%</span>
              </div>
              <input type="range" min="0" max="200" value={selectedLayer.contrast || 100} onChange={(e) => onUpdateLayer({ contrast: parseInt(e.target.value) })} className="w-full accent-blue-600" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Saturação</span>
                <span className="font-medium">{selectedLayer.saturate || 100}%</span>
              </div>
              <input type="range" min="0" max="200" value={selectedLayer.saturate || 100} onChange={(e) => onUpdateLayer({ saturate: parseInt(e.target.value) })} className="w-full accent-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* CARD DE POSIÇÃO (Sempre visível) */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mt-auto">
        <h4 className="font-semibold text-sm text-gray-700 mb-2 border-b pb-2">Posição & Tamanho</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded border">
          <div>X: {Math.round(selectedLayer.x)}px</div>
          <div>Y: {Math.round(selectedLayer.y)}px</div>
          <div>Larg: {Math.round(selectedLayer.width)}px</div>
          <div>Alt: {Math.round(selectedLayer.height)}px</div>
        </div>
      </div>

    </div>
  );
}
