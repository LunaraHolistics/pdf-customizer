/**
 * useLayerManager Hook
 * Manages layer state, operations, and selection
 */

import { useCallback, useState } from 'react';
import { Layer, SelectionState, TextLayer } from '@/types';
import { nanoid } from 'nanoid';

interface UseLayerManagerReturn {
  layers: Layer[];
  selectedState: SelectionState;
  addLayer: (layer: Omit<Layer, 'id' | 'zIndex'>) => string;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  deleteLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  selectLayer: (id: string | null, multiSelect?: boolean) => void;
  deselectAll: () => void;
  deleteSelected: () => void;
  moveLayerToFront: (id: string) => void;
  moveLayerToBack: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  clearLayers: () => void;
}

export const useLayerManager = (initialLayers: Layer[] = []): UseLayerManagerReturn => {
  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [selectedState, setSelectedState] = useState<SelectionState>({
    selectedLayerId: null,
    selectedLayers: [],
    isMultiSelect: false,
  });

  // Add new layer
  const addLayer = useCallback(
    (layer: Omit<Layer, 'id' | 'zIndex'>): string => {
      const id = nanoid();
      const newLayer: Layer = {
        ...layer,
        id,
        zIndex: layers.length,
      };
      setLayers((prev) => [...prev, newLayer]);
      return id;
    },
    [layers.length]
  );

  // Update layer
  const updateLayer = useCallback((id: string, updates: Partial<Layer>) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  }, []);

  // Delete layer (but not PDF layers)
  const deleteLayer = useCallback((id: string) => {
    const layerToDelete = layers.find((l) => l.id === id);
    // Prevent deletion of PDF layers
    if (layerToDelete?.type === 'pdf' || layerToDelete?.isDeletable === false) {
      return;
    }
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
    setSelectedState((prev) => ({
      ...prev,
      selectedLayerId: prev.selectedLayerId === id ? null : prev.selectedLayerId,
      selectedLayers: prev.selectedLayers.filter((lid) => lid !== id),
    }));
  }, [layers]);

  // Duplicate layer
  const duplicateLayer = useCallback((id: string) => {
    const layerToDuplicate = layers.find((l) => l.id === id);
    if (!layerToDuplicate) return;

    const newId = nanoid();
    const duplicated: Layer = {
      ...layerToDuplicate,
      id: newId,
      name: `${layerToDuplicate.name} (cópia)`,
      position: {
        x: layerToDuplicate.position.x + 10,
        y: layerToDuplicate.position.y + 10,
      },
      zIndex: Math.max(...layers.map((l) => l.zIndex)) + 1,
    };

    setLayers((prev) => [...prev, duplicated]);
  }, [layers]);

  // Reorder layers
  const reorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    setLayers((prev) => {
      const newLayers = [...prev];
      const [movedLayer] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, movedLayer);
      return newLayers.map((layer, index) => ({ ...layer, zIndex: index }));
    });
  }, []);

  // Select layer
  const selectLayer = useCallback((id: string | null, multiSelect = false) => {
    setSelectedState((prev) => {
      if (multiSelect && id) {
        const isAlreadySelected = prev.selectedLayers.includes(id);
        return {
          selectedLayerId: id,
          selectedLayers: isAlreadySelected
            ? prev.selectedLayers.filter((lid) => lid !== id)
            : [...prev.selectedLayers, id],
          isMultiSelect: true,
        };
      }
      return {
        selectedLayerId: id,
        selectedLayers: id ? [id] : [],
        isMultiSelect: false,
      };
    });
  }, []);

  // Deselect all
  const deselectAll = useCallback(() => {
    setSelectedState({
      selectedLayerId: null,
      selectedLayers: [],
      isMultiSelect: false,
    });
  }, []);

  // Delete selected layers
  const deleteSelected = useCallback(() => {
    const toDelete = selectedState.selectedLayers.length > 0
      ? selectedState.selectedLayers
      : selectedState.selectedLayerId
        ? [selectedState.selectedLayerId]
        : [];

    toDelete.forEach((id) => deleteLayer(id));
  }, [selectedState, deleteLayer]);

  // Move layer to front
  const moveLayerToFront = useCallback((id: string) => {
    setLayers((prev) => {
      const maxZIndex = Math.max(...prev.map((l) => l.zIndex));
      return prev.map((layer) =>
        layer.id === id ? { ...layer, zIndex: maxZIndex + 1 } : layer
      );
    });
  }, []);

  // Move layer to back
  const moveLayerToBack = useCallback((id: string) => {
    setLayers((prev) => {
      const minZIndex = Math.min(...prev.map((l) => l.zIndex));
      return prev.map((layer) =>
        layer.id === id ? { ...layer, zIndex: minZIndex - 1 } : layer
      );
    });
  }, []);

  // Toggle layer visibility
  const toggleLayerVisibility = useCallback((id: string) => {
    updateLayer(id, { visible: !layers.find((l) => l.id === id)?.visible });
  }, [layers, updateLayer]);

  // Toggle layer lock
  const toggleLayerLock = useCallback((id: string) => {
    updateLayer(id, { locked: !layers.find((l) => l.id === id)?.locked });
  }, [layers, updateLayer]);

  // Clear all layers (but keep PDF layer)
  const clearLayers = useCallback(() => {
    setLayers((prev) => prev.filter((l) => l.type !== 'pdf'));
    deselectAll();
  }, [deselectAll]);

  return {
    layers,
    selectedState,
    addLayer,
    updateLayer,
    deleteLayer,
    duplicateLayer,
    reorderLayers,
    selectLayer,
    deselectAll,
    deleteSelected,
    moveLayerToFront,
    moveLayerToBack,
    toggleLayerVisibility,
    toggleLayerLock,
    clearLayers,
  };
};
