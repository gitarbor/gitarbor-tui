import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { theme } from '../theme';
import { Modal } from './Modal';

interface ResetModalProps {
  commitHash: string;
  commitMessage: string;
  onReset: (mode: 'soft' | 'mixed' | 'hard') => void;
  onCancel: () => void;
}

export function ResetModal({ commitHash, commitMessage, onReset, onCancel }: ResetModalProps) {
  const [selectedMode, setSelectedMode] = useState<'soft' | 'mixed' | 'hard'>('mixed');

  const handleKeyPress = useCallback(
    (key: { name?: string; sequence?: string }) => {
      if (key.name === 'escape') {
        onCancel();
      } else if (key.name === 'return') {
        onReset(selectedMode);
      } else if (key.name === 'up') {
        setSelectedMode((prev) => {
          if (prev === 'hard') return 'mixed';
          if (prev === 'mixed') return 'soft';
          return prev;
        });
      } else if (key.name === 'down') {
        setSelectedMode((prev) => {
          if (prev === 'soft') return 'mixed';
          if (prev === 'mixed') return 'hard';
          return prev;
        });
      }
    },
    [onCancel, onReset, selectedMode],
  );

  useKeyboard(handleKeyPress);

  const getModeDescription = (mode: 'soft' | 'mixed' | 'hard') => {
    switch (mode) {
      case 'soft':
        return 'Keep all changes staged';
      case 'mixed':
        return 'Keep changes but unstage them';
      case 'hard':
        return 'Discard all changes (DANGEROUS)';
    }
  };

  return (
    <Modal width={80} height={18} title="Reset to Commit">
      <box flexDirection="row">
        <text fg={theme.colors.text.muted}>Commit: </text>
        <text fg={theme.colors.git.modified}>{commitHash} </text>
        <text fg={theme.colors.text.secondary}>{commitMessage}</text>
      </box>

      <box flexDirection="row" marginTop={theme.spacing.xs}>
        <text fg={theme.colors.text.secondary}>Select reset mode:</text>
      </box>

      <box flexDirection="row" marginTop={theme.spacing.xs}>
        <text fg={selectedMode === 'soft' ? theme.colors.primary : theme.colors.text.muted}>
          {selectedMode === 'soft' ? '> ' : '  '}
        </text>
        <text
          fg={selectedMode === 'soft' ? theme.colors.text.primary : theme.colors.text.secondary}
        >
          Soft - {getModeDescription('soft')}
        </text>
      </box>

      <box flexDirection="row">
        <text fg={selectedMode === 'mixed' ? theme.colors.primary : theme.colors.text.muted}>
          {selectedMode === 'mixed' ? '> ' : '  '}
        </text>
        <text
          fg={selectedMode === 'mixed' ? theme.colors.text.primary : theme.colors.text.secondary}
        >
          Mixed - {getModeDescription('mixed')}
        </text>
      </box>

      <box flexDirection="row">
        <text fg={selectedMode === 'hard' ? theme.colors.primary : theme.colors.text.muted}>
          {selectedMode === 'hard' ? '> ' : '  '}
        </text>
        <text
          fg={selectedMode === 'hard' ? theme.colors.status.error : theme.colors.text.secondary}
        >
          Hard - {getModeDescription('hard')}
        </text>
      </box>

      <box flexDirection="row" marginTop={theme.spacing.xs}>
        <text fg={theme.colors.status.warning}>
          Warning: This will change your commit history. Use with caution.
        </text>
      </box>

      <box flexDirection="row" marginTop={theme.spacing.xs}>
        <text fg={theme.colors.text.muted}>Use </text>
        <text fg={theme.colors.primary}>↑/↓</text>
        <text fg={theme.colors.text.muted}> to select, </text>
        <text fg={theme.colors.primary}>Enter</text>
        <text fg={theme.colors.text.muted}> to confirm, </text>
        <text fg={theme.colors.primary}>ESC</text>
        <text fg={theme.colors.text.muted}> to cancel</text>
      </box>
    </Modal>
  );
}
