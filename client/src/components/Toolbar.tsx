interface ToolbarProps {
  onLoadPdf: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onOpenHtm: () => void;
}

export default function Toolbar({ onLoadPdf, onAddText, onAddImage, onOpenHtm }: ToolbarProps) {
  return (
    <div className="h-14 bg-white shadow-md flex items-center px-4 gap-4 border-b border-gray-300">
      <button onClick={onLoadPdf} className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700">📄 Carregar PDF</button>
      <button onClick={onAddText} className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300">✏️ Texto</button>
      <button onClick={onAddImage} className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300">🖼️ Imagem</button>
      <button onClick={onOpenHtm} className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700">🌐 Abrir HTM</button>
    </div>
  );
}
