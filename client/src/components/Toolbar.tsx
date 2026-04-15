interface ToolbarProps {
  onLoadPdf: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onOpenHtm: () => void;
}

export default function Toolbar({ onLoadPdf, onAddText, onAddImage, onOpenHtm }: ToolbarProps) {
  return (
    <div className="h-12 bg-[#2d2d2d] shadow-lg flex items-center px-4 gap-2 border-b border-[#444]">
      <button onClick={onLoadPdf} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
        <span>📄</span> Carregar PDF
      </button>
      
      <div className="w-px h-6 bg-[#555] mx-1"></div>

      <button onClick={onAddText} className="px-3 py-1.5 bg-[#404040] text-gray-200 text-sm rounded hover:bg-[#505050] transition-colors">✏️ Texto</button>
      <button onClick={onAddImage} className="px-3 py-1.5 bg-[#404040] text-gray-200 text-sm rounded hover:bg-[#505050] transition-colors">🖼️ Imagem</button>
      
      <div className="flex-1"></div>

      <button onClick={onOpenHtm} className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
        <span>🌐</span> Análise HTM
      </button>
    </div>
  );
}
