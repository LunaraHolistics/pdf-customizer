/**
 * HelpDialog Component
 * Displays help and tutorial information
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const HelpDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle size={16} />
          Ajuda
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajuda e Tutorial</DialogTitle>
          <DialogDescription>
            Aprenda como usar o PDF Customizer
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basics">Básico</TabsTrigger>
            <TabsTrigger value="editing">Edição</TabsTrigger>
            <TabsTrigger value="tips">Dicas</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-3">
            <div>
              <h3 className="font-semibold text-sm mb-2">Começando</h3>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• Clique em "Carregar PDF" para adicionar um arquivo PDF</li>
                <li>• Use "Adicionar Texto" para inserir caixas de texto</li>
                <li>• Use "Adicionar Imagem" para inserir imagens</li>
                <li>• Clique em "Gerar PDF" para baixar seu documento</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="editing" className="space-y-3">
            <div>
              <h3 className="font-semibold text-sm mb-2">Editando Elementos</h3>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• Arraste elementos para mover</li>
                <li>• Redimensione usando as bordas</li>
                <li>• Selecione para editar propriedades</li>
                <li>• Use o painel direito para ajustes avançados</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Camadas</h3>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• Organize elementos na lista de camadas</li>
                <li>• Controle visibilidade e bloqueio</li>
                <li>• Reordene com os botões de seta</li>
                <li>• Duplique elementos facilmente</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-3">
            <div>
              <h3 className="font-semibold text-sm mb-2">Dicas Úteis</h3>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>💡 Use opacidade baixa para criar marcas d&apos;água</li>
                <li>💡 Bloqueie elementos para evitar movimentos acidentais</li>
                <li>💡 Use linhas-guia para alinhamento perfeito</li>
                <li>💡 Salve seus projetos regularmente</li>
                <li>💡 O app funciona offline após o primeiro carregamento</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
