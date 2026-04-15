/**
 * useKeyboardShortcuts Hook
 * Handles keyboard shortcuts for common actions
 */

import { useEffect } from 'react';

interface KeyboardShortcutsConfig {
  onDelete?: () => void;
  onDuplicate?: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
}

export const useKeyboardShortcuts = (config: KeyboardShortcutsConfig) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return;
      }

      // Delete key
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        config.onDelete?.();
      }

      // Ctrl/Cmd + D: Duplicate
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        config.onDuplicate?.();
      }

      // Ctrl/Cmd + A: Select All
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        config.onSelectAll?.();
      }

      // Escape: Deselect All
      if (event.key === 'Escape') {
        event.preventDefault();
        config.onDeselectAll?.();
      }

      // Ctrl/Cmd + Z: Undo
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        config.onUndo?.();
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      if (
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z') ||
        ((event.ctrlKey || event.metaKey) && event.key === 'y')
      ) {
        event.preventDefault();
        config.onRedo?.();
      }

      // Ctrl/Cmd + S: Save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        config.onSave?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [config]);
};
