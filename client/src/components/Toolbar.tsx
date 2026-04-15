interface ToolbarProps {
  onAddText: () => void;
  onAddImage: () => void;
}

export default function Toolbar({ onAddText, onAddImage }: ToolbarProps) {
  const btnClass = "px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium shadow-sm";
  
  return (
    <div className="flex items-center gap-2">
      <button onClick={onAddText} className={btnClass}>✏️ Adicionar Texto</button>
      <button onClick={onAddImage} className={btnClass}>🖼️ Adicionar Imagem</button>
    </div>
  );
}
