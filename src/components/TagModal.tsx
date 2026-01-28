import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { theme } from '../theme';
import { Modal } from './Modal';
import { Input } from './Input';

interface TagModalProps {
  commitHash?: string;
  commitMessage?: string;
  onCreateTag: (tagName: string, message?: string) => void;
  onCancel: () => void;
}

export function TagModal({ commitHash, commitMessage, onCreateTag, onCancel }: TagModalProps) {
  const [tagName, setTagName] = useState('');
  const [tagMessage, setTagMessage] = useState('');
  const [focusedField, setFocusedField] = useState<'name' | 'message'>('name');

  const handleSubmit = useCallback(() => {
    if (tagName.trim()) {
      onCreateTag(tagName, tagMessage || undefined);
    }
  }, [tagName, tagMessage, onCreateTag]);

  const handleKeyPress = useCallback(
    (key: { name?: string; sequence?: string; ctrl?: boolean }) => {
      if (key.name === 'escape') {
        onCancel();
      } else if (key.name === 'tab') {
        setFocusedField((prev) => (prev === 'name' ? 'message' : 'name'));
      }
    },
    [onCancel],
  );

  useKeyboard(handleKeyPress);

  return (
    <Modal width={80} height={18} title="Create Tag">
      {commitHash && commitMessage && (
        <box flexDirection="row" marginBottom={theme.spacing.xs}>
          <text fg={theme.colors.text.muted}>Commit: </text>
          <text fg={theme.colors.git.modified}>{commitHash} </text>
          <text fg={theme.colors.text.secondary}>{commitMessage}</text>
        </box>
      )}

      {!commitHash && (
        <box flexDirection="row" marginBottom={theme.spacing.xs}>
          <text fg={theme.colors.text.muted}>Creating tag at current HEAD</text>
        </box>
      )}

      <box flexDirection="column" marginTop={theme.spacing.sm}>
        <text fg={theme.colors.text.secondary}>Tag name:</text>
        <Input
          width={76}
          value={tagName}
          onInput={setTagName}
          onSubmit={handleSubmit}
          placeholder="v1.0.0"
          focused={focusedField === 'name'}
        />
      </box>

      <box flexDirection="column" marginTop={theme.spacing.sm}>
        <text fg={theme.colors.text.secondary}>Tag message (optional):</text>
        <Input
          width={76}
          value={tagMessage}
          onInput={setTagMessage}
          onSubmit={handleSubmit}
          placeholder="Release notes..."
          focused={focusedField === 'message'}
        />
      </box>

      <box flexDirection="row" marginTop={theme.spacing.sm}>
        <text fg={theme.colors.text.muted}>
          [Tab] Switch Fields | [Enter] Create | [Esc] Cancel
        </text>
      </box>
    </Modal>
  );
}
