import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { theme } from '../theme';
import { Modal } from './Modal';
import { Input } from './Input';

interface RenameModalProps {
  currentPath: string;
  onRename: (newPath: string) => void;
  onCancel: () => void;
}

export function RenameModal({ currentPath, onRename, onCancel }: RenameModalProps) {
  const [newPath, setNewPath] = useState(currentPath);

  const handleSubmit = useCallback(() => {
    if (newPath.trim() && newPath !== currentPath) {
      onRename(newPath.trim());
    }
  }, [newPath, currentPath, onRename]);

  useKeyboard((key) => {
    if (key.name === 'escape') {
      onCancel();
    }
  });

  return (
    <Modal width={80} height={12} title="Rename/Move File">
      {/* Current path */}
      <text fg={theme.colors.text.muted}>Current path:</text>
      <text fg={theme.colors.text.secondary}>{currentPath}</text>

      <text> </text>

      {/* New path */}
      <text fg={theme.colors.text.muted}>New path:</text>
      <Input
        width={76}
        placeholder="Enter new path"
        value={newPath}
        onInput={(value) => setNewPath(value)}
        onSubmit={handleSubmit}
        focused={true}
      />

      <text> </text>

      {/* Help text */}
      <box
        borderStyle={theme.borders.style}
        borderColor={theme.colors.border}
        padding={theme.spacing.none}
      >
        <text fg={theme.colors.text.muted}>[Enter] Rename | [Esc] Cancel</text>
      </box>
    </Modal>
  );
}
