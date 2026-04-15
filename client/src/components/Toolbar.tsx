interface ToolbarProps {
  onLoadPdf: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onOpenHtm: () => void;
}

export default function Toolbar({ onLoadPdf, onAddText, onAddImage, onOpenHtm }: ToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onLoadPdf} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow">
        CARREGAR PDF
      </button>
      
      <button onClick={onAddText} className="px-3 py-1.5 bg-[#333] text-gray-300 text-xs font-medium rounded-lg hover:bg-[#444] transition-colors border border-[#444]">
        ✏️ Texto
      </button>
      <button onClick={onAddImage} className="px-3 py-1.5 bg-[#333] text-gray-300 text-xs font-medium rounded-lg hover:bg-[#444] transition-colors border border-[#444]">
        🖼️ Imagem
      </button>
      
      <button onClick={onOpenHtm} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow ml-2">
        ABRIR HTM
      </button>
    </div>
  );
}
