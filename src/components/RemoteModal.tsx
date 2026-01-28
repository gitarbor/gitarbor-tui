import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { theme } from '../theme';
import { Modal } from './Modal';
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
  const [editMode, setEditMode] = useState(false);

  const handleSubmit = useCallback(() => {
    if (name.trim() && fetchUrl.trim()) {
      onSubmit(name.trim(), fetchUrl.trim(), pushUrl.trim() || undefined);
    }
  }, [name, fetchUrl, pushUrl, onSubmit]);

  useKeyboard((key) => {
    if (!editMode) {
      if (key.name === 'escape') {
        onCancel();
      } else if (key.name === 'return') {
        handleSubmit();
      } else if (key.name === 'tab') {
        // Cycle through fields
        if (focusedField === 'name') {
          setFocusedField('fetchUrl');
        } else if (focusedField === 'fetchUrl') {
          setFocusedField('pushUrl');
        } else {
          setFocusedField('name');
        }
      } else if (key.sequence === 'e' || key.name === 'space') {
        setEditMode(true);
      }
    } else {
      // Edit mode - capture input
      if (key.name === 'escape') {
        setEditMode(false);
      } else if (key.name === 'return') {
        setEditMode(false);
      } else if (key.name === 'backspace') {
        if (focusedField === 'name') {
          setName((prev) => prev.slice(0, -1));
        } else if (focusedField === 'fetchUrl') {
          setFetchUrl((prev) => prev.slice(0, -1));
        } else if (focusedField === 'pushUrl') {
          setPushUrl((prev) => prev.slice(0, -1));
        }
      } else if (key.sequence && key.sequence.length === 1) {
        if (focusedField === 'name') {
          setName((prev) => prev + key.sequence);
        } else if (focusedField === 'fetchUrl') {
          setFetchUrl((prev) => prev + key.sequence);
        } else if (focusedField === 'pushUrl') {
          setPushUrl((prev) => prev + key.sequence);
        }
      }
    }
  });

  const title = mode === 'add' ? 'Add Remote' : 'Edit Remote';

  return (
    <Modal width={80} height={16} title={title}>
      <box width="100%" flexGrow={1} flexDirection="column">
        <box width="100%" height={2} flexDirection="column" paddingBottom={theme.spacing.xs}>
          <box width="100%">
            <text fg={focusedField === 'name' ? theme.colors.primary : theme.colors.text.secondary}>
              {focusedField === 'name' ? '▶ ' : '  '}Name:
            </text>
          </box>
          <box width="100%" paddingLeft={theme.spacing.md}>
            <text
              fg={
                focusedField === 'name' && editMode
                  ? theme.colors.status.success
                  : theme.colors.text.primary
              }
            >
              {name || (editMode && focusedField === 'name' ? '█' : '(empty)')}
            </text>
          </box>
        </box>

        <box width="100%" height={2} flexDirection="column" paddingBottom={theme.spacing.xs}>
          <box width="100%">
            <text
              fg={focusedField === 'fetchUrl' ? theme.colors.primary : theme.colors.text.secondary}
            >
              {focusedField === 'fetchUrl' ? '▶ ' : '  '}Fetch URL:
            </text>
          </box>
          <box width="100%" paddingLeft={theme.spacing.md}>
            <text
              fg={
                focusedField === 'fetchUrl' && editMode
                  ? theme.colors.status.success
                  : theme.colors.text.primary
              }
            >
              {fetchUrl || (editMode && focusedField === 'fetchUrl' ? '█' : '(empty)')}
            </text>
          </box>
        </box>

        <box width="100%" height={2} flexDirection="column" paddingBottom={theme.spacing.xs}>
          <box width="100%">
            <text
              fg={focusedField === 'pushUrl' ? theme.colors.primary : theme.colors.text.secondary}
            >
              {focusedField === 'pushUrl' ? '▶ ' : '  '}Push URL (optional):
            </text>
          </box>
          <box width="100%" paddingLeft={theme.spacing.md}>
            <text
              fg={
                focusedField === 'pushUrl' && editMode
                  ? theme.colors.status.success
                  : theme.colors.text.primary
              }
            >
              {pushUrl || (editMode && focusedField === 'pushUrl' ? '█' : '(same as fetch)')}
            </text>
          </box>
        </box>
      </box>

      <text> </text>

      <box
        borderStyle={theme.borders.style}
        borderColor={theme.colors.border}
        padding={theme.spacing.none}
      >
        <text fg={theme.colors.text.muted}>
          {editMode
            ? 'Enter: save field  Esc: cancel edit'
            : 'Tab: next  e/Space: edit  Enter: submit  Esc: cancel'}
        </text>
      </box>
    </Modal>
  );
}
