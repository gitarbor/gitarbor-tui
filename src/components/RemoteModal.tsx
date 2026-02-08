import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { theme } from '../theme';
import { Modal } from './Modal';
import { Input } from './Input';
import type { GitRemote } from '../types/git';

interface RemoteModalProps {
  mode: 'add' | 'edit';
  existingRemote?: GitRemote;
  onSubmit: (name: string, fetchUrl: string, pushUrl?: string) => void;
  onCancel: () => void;
}

export function RemoteModal({ mode, existingRemote, onSubmit, onCancel }: RemoteModalProps) {
  const [name, setName] = useState(existingRemote?.name || '');
  const [fetchUrl, setFetchUrl] = useState(existingRemote?.fetchUrl || '');
  const [pushUrl, setPushUrl] = useState(
    existingRemote?.pushUrl && existingRemote.pushUrl !== existingRemote.fetchUrl
      ? existingRemote.pushUrl
      : '',
  );
  const [focusedField, setFocusedField] = useState<'name' | 'fetchUrl' | 'pushUrl'>('name');

  const handleSubmit = useCallback(() => {
    if (name.trim() && fetchUrl.trim()) {
      onSubmit(name.trim(), fetchUrl.trim(), pushUrl.trim() || undefined);
    }
  }, [name, fetchUrl, pushUrl, onSubmit]);

  useKeyboard((key) => {
    if (key.name === 'escape') {
      onCancel();
    } else if (key.name === 'tab') {
      // Cycle through fields
      if (focusedField === 'name') {
        setFocusedField('fetchUrl');
      } else if (focusedField === 'fetchUrl') {
        setFocusedField('pushUrl');
      } else {
        setFocusedField('name');
      }
    }
  });

  const title = mode === 'add' ? 'Add Remote' : 'Edit Remote';

  return (
    <Modal width={80} height={18} title={title}>
      <box width="100%" flexGrow={1} flexDirection="column">
        <Input
          label="Name"
          value={name}
          onChange={setName}
          onSubmit={handleSubmit}
          focused={focusedField === 'name'}
          placeholder="e.g., origin"
          fieldsetHeight={3}
          flexGrow={0}
        />

        <Input
          label="Fetch URL"
          value={fetchUrl}
          onChange={setFetchUrl}
          onSubmit={handleSubmit}
          focused={focusedField === 'fetchUrl'}
          placeholder="e.g., https://github.com/user/repo.git"
          fieldsetHeight={3}
          flexGrow={0}
        />

        <Input
          label="Push URL (optional)"
          value={pushUrl}
          onChange={setPushUrl}
          onSubmit={handleSubmit}
          focused={focusedField === 'pushUrl'}
          placeholder="Leave empty to use fetch URL"
          fieldsetHeight={3}
          flexGrow={0}
        />
      </box>

      <text> </text>

      <box
        borderStyle={theme.borders.style}
        borderColor={theme.colors.border}
        padding={theme.spacing.none}
      >
        <text fg={theme.colors.text.muted}>Tab: next  Enter: submit  Esc: cancel</text>
      </box>
    </Modal>
  );
}
