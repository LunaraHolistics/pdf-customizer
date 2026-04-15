interface ToolbarProps {
  onLoadPdf: (url: string) => void;
  onAddText: () => void;
  onOpenHtm: () => void;
}

export default function Toolbar({ onLoadPdf, onAddText, onOpenHtm }: ToolbarProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onLoadPdf(url);
    e.target.value = '';
  };

  return (
    <div className="h-14 bg-white shadow-md flex items-center px-4 gap-4 border-b border-gray-300">
      <input type="file" accept=".pdf" className="hidden" id="pdf-upload" onChange={handleFileChange} />
      
      <label htmlFor="pdf-upload" className="cursor-pointer px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
        📄 Carregar PDF
      </label>

      <button onClick={onAddText} className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300">✏️ Texto</button>
      
      <button onClick={onOpenHtm} className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700">🌐 Abrir HTM</button>
    </div>
  );
}
