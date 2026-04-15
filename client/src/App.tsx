import { useRef } from 'react'
import './App.css'

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleOpenHtm = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    reader.readAsText(file)
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>BioSync Editor (Web)</h1>
      <p>Selecione um arquivo .htm do seu computador para visualizar.</p>
      
      {/* Input oculto */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept=".htm,.html" 
        style={{ display: 'none' }} 
        onChange={handleOpenHtm} 
      />

      {/* Botão Visível */}
      <button
        onClick={handleButtonClick}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginTop: '20px',
          fontWeight: 'bold'
        }}
      >
        Abrir Análises HTM
      </button>

      <div style={{ marginTop: '40px', padding: '20px', background: '#f3f4f6', borderRadius: '8px', display: 'inline-block' }}>
        <h3>Como funciona?</h3>
        <p style={{ fontSize: '14px', color: '#555', maxWidth: '400px' }}>
          Ao clicar no botão, você selecionará um arquivo local. O app lerá o conteúdo, 
          criará uma URL temporária segura e abrirá o arquivo em uma nova aba do navegador, 
          simulando o comportamento de um servidor local.
        </p>
      </div>
    </div>
  )
}

export default App