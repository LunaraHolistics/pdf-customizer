/**
 * ProjectManager Component
 * Handles project save/load operations
 */

import React, { useEffect, useState } from 'react';
import { PDFProject } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Save, Folder, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectManagerProps {
  onSave?: (projectName: string) => void;
  onLoad?: (project: PDFProject) => void;
  currentProjectName?: string;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  onSave,
  onLoad,
  currentProjectName = 'Sem título',
}) => {
  const [projectName, setProjectName] = useState(currentProjectName);
  const [projects, setProjects] = useState<PDFProject[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load projects from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('pdf-customizer-projects');
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }
  }, []);

  const handleSave = () => {
    if (!projectName.trim()) {
      toast.error('Digite um nome para o projeto');
      return;
    }

    onSave?.(projectName);
    toast.success('Projeto salvo com sucesso!');
    setIsOpen(false);
  };

  const handleLoadProject = (project: PDFProject) => {
    onLoad?.(project);
    toast.success(`Projeto "${project.name}" carregado`);
    setIsOpen(false);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este projeto?')) {
      const updated = projects.filter((p) => p.id !== projectId);
      setProjects(updated);
      localStorage.setItem('pdf-customizer-projects', JSON.stringify(updated));
      toast.success('Projeto deletado');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Folder size={16} />
          Projetos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar Projetos</DialogTitle>
          <DialogDescription>
            Salve e carregue seus projetos de PDF
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Save section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Projeto</label>
            <div className="flex gap-2">
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Digite o nome do projeto"
              />
              <Button onClick={handleSave} size="sm" className="gap-2">
                <Save size={16} />
                Salvar
              </Button>
            </div>
          </div>

          {/* Projects list */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Projetos Salvos</label>
            {projects.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum projeto salvo</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {project.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLoadProject(project)}
                      >
                        Carregar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
