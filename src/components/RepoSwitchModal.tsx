import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { theme } from '../theme';
import { Modal } from './Modal';

interface RepoSwitchModalProps {
  repoName: string;
  stagedCount: number;
  unstagedCount: number;
  untrackedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RepoSwitchModal({
  repoName,
  stagedCount,
  unstagedCount,
  untrackedCount,
  onConfirm,
  onCancel,
}: RepoSwitchModalProps) {
  const totalChanges = stagedCount + unstagedCount + untrackedCount;
  const [selectedOption, setSelectedOption] = useState<'confirm' | 'cancel'>('cancel');

  const handleKeyboard = useCallback(
    (key: { name: string; sequence?: string }) => {
      // Handle arrow keys for navigation
      if (key.name === 'left') {
        setSelectedOption('confirm');
        return;
      }
      if (key.name === 'right') {
        setSelectedOption('cancel');
        return;
      }

      // Handle Enter to confirm selection
      if (key.name === 'return') {
        if (selectedOption === 'confirm') {
          onConfirm();
        } else {
          onCancel();
        }
        return;
      }

      // Handle Y/N keys directly
      if (key.sequence === 'y' || key.sequence === 'Y') {
        onConfirm();
        return;
      }
      if (key.sequence === 'n' || key.sequence === 'N' || key.name === 'escape') {
        onCancel();
        return;
      }
    },
    [selectedOption, onConfirm, onCancel],
  );

  useKeyboard(handleKeyboard);

  return (
    <Modal
      width={70}
      height={16}
      title="⚠ Uncommitted Changes"
      borderColor={theme.colors.status.warning}
    >
      {/* Message */}
      <box flexDirection="column" paddingBottom={theme.spacing.sm}>
        <text fg={theme.colors.text.primary}>
          You have {totalChanges} uncommitted change{totalChanges === 1 ? '' : 's'}:
        </text>
        <box paddingTop={theme.spacing.xs} paddingLeft={theme.spacing.sm} flexDirection="column">
          {stagedCount > 0 && (
            <text fg={theme.colors.git.staged}>
              • {stagedCount} staged file{stagedCount === 1 ? '' : 's'}
            </text>
          )}
          {unstagedCount > 0 && (
            <text fg={theme.colors.git.modified}>
              • {unstagedCount} unstaged file{unstagedCount === 1 ? '' : 's'}
            </text>
          )}
          {untrackedCount > 0 && (
            <text fg={theme.colors.git.untracked}>
              • {untrackedCount} untracked file{untrackedCount === 1 ? '' : 's'}
            </text>
          )}
        </box>
        <box paddingTop={theme.spacing.sm}>
          <text fg={theme.colors.text.secondary}>Switch to "{repoName}" anyway?</text>
        </box>
        <box paddingTop={theme.spacing.xs}>
          <text fg={theme.colors.text.muted}>
            (Consider committing or stashing your changes first)
          </text>
        </box>
      </box>

      {/* Buttons */}
      <box style={{ justifyContent: 'center', flexDirection: 'row', gap: 3 }}>
        <text
          bg={
            selectedOption === 'confirm'
              ? theme.colors.status.warning
              : theme.colors.background.button
          }
          fg={
            selectedOption === 'confirm' ? theme.colors.text.inverted : theme.colors.text.disabled
          }
        >
          {selectedOption === 'confirm' ? '[✓ Yes, Switch]' : '  Yes, Switch  '}
        </text>
        <text
          bg={
            selectedOption === 'cancel' ? theme.colors.status.info : theme.colors.background.button
          }
          fg={selectedOption === 'cancel' ? theme.colors.text.primary : theme.colors.text.disabled}
        >
          {selectedOption === 'cancel' ? '[✓ No, Cancel]' : '  No, Cancel  '}
        </text>
      </box>
      <box
        style={{
          marginTop: 1,
          justifyContent: 'center',
          border: true,
          borderColor: theme.colors.background.buttonHover,
          paddingLeft: theme.spacing.xs,
          paddingRight: theme.spacing.xs,
          flexDirection: 'row',
          gap: 1,
        }}
      >
        <text fg={theme.colors.text.disabled}>←→ select │ Enter confirm │ Y/N quick select</text>
      </box>
    </Modal>
  );
}
