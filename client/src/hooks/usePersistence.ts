/**
 * usePersistence Hook
 * Manages persistence of PDF projects using IndexedDB
 */

import { useCallback, useEffect, useState } from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { PDFProject, Layer } from '@/types';

interface PDFCustomizerDB extends DBSchema {
  projects: {
    key: string;
    value: PDFProject;
    indexes: { 'by-date': number };
  };
  layers: {
    key: string;
    value: Layer & { projectId: string };
    indexes: { 'by-project': string };
  };
}

const DB_NAME = 'pdf-customizer-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<PDFCustomizerDB> | null = null;

const initDB = async (): Promise<IDBPDatabase<PDFCustomizerDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<PDFCustomizerDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create projects store
      if (!db.objectStoreNames.contains('projects')) {
        const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
        projectStore.createIndex('by-date', 'updatedAt');
      }

      // Create layers store
      if (!db.objectStoreNames.contains('layers')) {
        const layerStore = db.createObjectStore('layers', { keyPath: 'id' });
        layerStore.createIndex('by-project', 'projectId');
      }
    },
  });

  return dbInstance;
};

interface UsePersistenceReturn {
  saveProject: (project: PDFProject) => Promise<void>;
  loadProject: (projectId: string) => Promise<PDFProject | undefined>;
  deleteProject: (projectId: string) => Promise<void>;
  getAllProjects: () => Promise<PDFProject[]>;
  saveLayers: (projectId: string, layers: Layer[]) => Promise<void>;
  loadLayers: (projectId: string) => Promise<Layer[]>;
  isReady: boolean;
  error: Error | null;
}

export const usePersistence = (): UsePersistenceReturn => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initDB();
        setIsReady(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize DB'));
      }
    };

    init();
  }, []);

  const saveProject = useCallback(async (project: PDFProject) => {
    if (!dbInstance) throw new Error('Database not initialized');
    try {
      await dbInstance.put('projects', {
        ...project,
        updatedAt: new Date(),
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save project'));
      throw err;
    }
  }, []);

  const loadProject = useCallback(async (projectId: string) => {
    if (!dbInstance) throw new Error('Database not initialized');
    try {
      return await dbInstance.get('projects', projectId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load project'));
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (projectId: string) => {
    if (!dbInstance) throw new Error('Database not initialized');
    try {
      await dbInstance.delete('projects', projectId);
      // Also delete associated layers
      const layers = await dbInstance.getAllFromIndex('layers', 'by-project', projectId);
      for (const layer of layers) {
        await dbInstance.delete('layers', layer.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete project'));
      throw err;
    }
  }, []);

  const getAllProjects = useCallback(async () => {
    if (!dbInstance) throw new Error('Database not initialized');
    try {
      return await dbInstance.getAll('projects');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get projects'));
      throw err;
    }
  }, []);

  const saveLayers = useCallback(async (projectId: string, layers: Layer[]) => {
    if (!dbInstance) throw new Error('Database not initialized');
    try {
      // Delete old layers for this project
      const oldLayers = await dbInstance.getAllFromIndex('layers', 'by-project', projectId);
      for (const layer of oldLayers) {
        await dbInstance.delete('layers', layer.id);
      }

      // Save new layers
      for (const layer of layers) {
        await dbInstance.put('layers', {
          ...layer,
          projectId,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save layers'));
      throw err;
    }
  }, []);

  const loadLayers = useCallback(async (projectId: string) => {
    if (!dbInstance) throw new Error('Database not initialized');
    try {
      return await dbInstance.getAllFromIndex('layers', 'by-project', projectId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load layers'));
      throw err;
    }
  }, []);

  return {
    saveProject,
    loadProject,
    deleteProject,
    getAllProjects,
    saveLayers,
    loadLayers,
    isReady,
    error,
  };
};
