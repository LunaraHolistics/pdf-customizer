# PDF Customizer PWA

Uma aplicação web progressiva (PWA) para personalização de documentos PDF com suporte a múltiplas camadas de imagem e texto, preview interativo e funcionamento offline.

## 🎯 Funcionalidades

### Core
- ✅ **Upload de PDF**: Carregue seus documentos PDF para personalização
- ✅ **Editor de Camadas**: Adicione, edite e organize múltiplas camadas de texto e imagem
- ✅ **Drag & Drop**: Arraste e redimensione elementos livremente no canvas
- ✅ **Preview em Tempo Real**: Visualize as alterações instantaneamente
- ✅ **Geração de PDF**: Exporte seu documento personalizado como PDF

### Edição Avançada
- ✅ **Ajustes de Imagem**: Brilho, contraste, saturação, opacidade e rotação de matiz
- ✅ **Efeito Marca d'Água**: Ajuste opacidade para criar marcas d'água
- ✅ **Edição de Texto**: Fonte, tamanho, cor, alinhamento e altura de linha
- ✅ **Linhas-Guia**: Alinhamento automático com snap guides
- ✅ **Bloqueio de Camadas**: Proteja elementos contra movimentos acidentais

### PWA & Offline
- ✅ **Funcionamento Offline**: Trabalhe sem conexão de internet
- ✅ **Service Worker**: Cache automático de recursos
- ✅ **Instalação Local**: Instale como aplicativo no seu dispositivo
- ✅ **Persistência**: Salvamento automático com IndexedDB

### UI/UX
- ✅ **Painel de Camadas**: Gerenciamento completo de elementos
- ✅ **Painéis de Ajustes**: Controles intuitivos para cada tipo de elemento
- ✅ **Status Online/Offline**: Indicador de conectividade
- ✅ **Ajuda Integrada**: Tutorial e dicas de uso
- ✅ **Gerenciador de Projetos**: Salve e carregue seus projetos

## 🚀 Como Usar

### Começando
1. Abra a aplicação em seu navegador
2. Clique em "Carregar PDF" para adicionar um documento
3. Use "Adicionar Texto" ou "Adicionar Imagem" para inserir elementos
4. Arraste e redimensione os elementos conforme necessário
5. Clique em "Gerar PDF" para baixar seu documento personalizado

### Editando Elementos
- **Mover**: Clique e arraste o elemento
- **Redimensionar**: Arraste as bordas do elemento
- **Editar Propriedades**: Selecione o elemento e use os painéis laterais
- **Bloquear**: Clique no ícone de cadeado para proteger o elemento
- **Ocultar**: Clique no ícone de olho para ocultar o elemento

### Ajustes de Imagem
- **Brilho**: Aumente ou diminua a luminosidade
- **Contraste**: Ajuste a diferença entre claro e escuro
- **Saturação**: Controle a intensidade das cores
- **Opacidade**: Crie efeito de marca d'água reduzindo a opacidade
- **Rotação de Matiz**: Altere as cores da imagem

## 🛠️ Stack Técnico

- **Frontend**: React 19 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS 4
- **PDF**: pdf-lib (geração), PDF.js (visualização)
- **Drag & Drop**: react-rnd
- **Persistência**: IndexedDB (idb)
- **PWA**: Service Worker, manifest.json

## 📦 Dependências Principais

```json
{
  "react": "^19.2.1",
  "react-dom": "^19.2.1",
  "typescript": "5.6.3",
  "vite": "^7.1.7",
  "tailwindcss": "^4.1.14",
  "pdf-lib": "^1.17.1",
  "pdfjs-dist": "^5.6.205",
  "react-rnd": "^10.5.3",
  "idb": "^8.0.3"
}
```

## 🎨 Estrutura do Projeto

```
client/
├── src/
│   ├── components/        # Componentes React
│   ├── hooks/            # Hooks customizados
│   ├── lib/              # Utilitários e helpers
│   ├── pages/            # Páginas
│   ├── types/            # Tipos TypeScript
│   ├── App.tsx           # Componente raiz
│   ├── main.tsx          # Entry point
│   └── index.css         # Estilos globais
├── public/
│   ├── sw.js            # Service Worker
│   └── manifest.json    # Configuração PWA
└── index.html           # HTML principal
```

## 🔑 Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Delete` | Deletar elemento selecionado |
| `Ctrl/Cmd + D` | Duplicar elemento |
| `Ctrl/Cmd + A` | Selecionar tudo |
| `Escape` | Desselecionar tudo |
| `Ctrl/Cmd + Z` | Desfazer |
| `Ctrl/Cmd + Shift + Z` | Refazer |
| `Ctrl/Cmd + S` | Salvar projeto |

## 💾 Persistência de Dados

### LocalStorage
- Projetos salvos localmente
- Configurações do usuário
- Histórico de ações

### IndexedDB
- Camadas de projetos
- Dados de PDF
- Cache de imagens

## 🌐 Funcionamento Offline

A aplicação funciona completamente offline após o primeiro carregamento:

1. **Service Worker**: Intercepta requisições e serve do cache
2. **Cache**: Recursos estáticos são armazenados localmente
3. **IndexedDB**: Dados de projetos são persistidos
4. **Sincronização**: Alterações são sincronizadas quando online

## 📱 Instalação como Aplicativo

### Desktop
1. Abra a aplicação no navegador
2. Clique em "Instalar" no cabeçalho
3. Confirme a instalação
4. Acesse como aplicativo desktop

### Mobile
1. Abra em navegador compatível (Chrome, Firefox, Safari)
2. Toque no menu (⋮) ou compartilhar
3. Selecione "Adicionar à tela inicial"
4. Acesse como aplicativo mobile

## 🎓 Dicas de Uso

- 💡 Use opacidade baixa para criar marcas d'água profissionais
- 💡 Bloqueie elementos importantes para evitar movimentos acidentais
- 💡 Use linhas-guia para alinhamento perfeito
- 💡 Salve seus projetos regularmente
- 💡 Teste em diferentes dispositivos para garantir compatibilidade
- 💡 Use cores contrastantes para melhor legibilidade

## 🐛 Troubleshooting

### PDF não carrega
- Verifique se o arquivo é um PDF válido
- Tente em outro navegador
- Limpe o cache do navegador

### Elementos não aparecem no PDF gerado
- Verifique se os elementos estão visíveis (ícone de olho)
- Certifique-se de que estão dentro dos limites da página
- Tente aumentar o tamanho do elemento

### Aplicativo não funciona offline
- Verifique se o Service Worker foi registrado
- Limpe o cache e recarregue
- Tente acessar novamente após alguns segundos

## 📄 Licença

MIT

## 🤝 Suporte

Para suporte, dúvidas ou sugestões, entre em contato.

---

**Desenvolvido com ❤️ para facilitar a personalização de documentos PDF**
