import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { theme } from '../theme';

interface CommitActionModalProps {
  title: string;
  commitHash: string;
  commitMessage: string;
  action: 'cherry-pick' | 'revert' | 'amend' | 'reset' | 'tag';
  onConfirm: () => void;
  onCancel: () => void;
  requiresInput?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  onInputChange?: (value: string) => void;
  children?: React.ReactNode;
}

export function CommitActionModal({
  title,
  commitHash,
  commitMessage,
  action,
  onConfirm,
  onCancel,
  requiresInput = false,
  inputLabel = '',
  inputPlaceholder = '',
  onInputChange,
  children,
}: CommitActionModalProps) {
  const [input, setInput] = useState('');

  const handleKeyPress = useCallback(
    (key: { name?: string; sequence?: string }) => {
      if (key.name === 'escape') {
        onCancel();
      } else if (key.name === 'return') {
        if (requiresInput && onInputChange) {
          onInputChange(input);
        }
        onConfirm();
      } else if (requiresInput) {
        if (key.name === 'backspace') {
          setInput((prev) => prev.slice(0, -1));
        } else if (key.sequence && key.sequence.length === 1) {
          setInput((prev) => prev + key.sequence);
        }
      }
    },
    [onCancel, onConfirm, requiresInput, onInputChange, input],
  );

  useKeyboard(handleKeyPress);

  const getActionDescription = () => {
    switch (action) {
      case 'cherry-pick':
        return 'Apply the changes from this commit to the current branch';
      case 'revert':
        return 'Create a new commit that undoes the changes from this commit';
      case 'amend':
        return 'Modify the last commit with staged changes';
      case 'reset':
        return 'Reset current branch to this commit';
      case 'tag':
        return 'Create a tag pointing to this commit';
      default:
        return '';
    }
  };

  return (
    <box
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <box
        width={80}
        height={requiresInput ? 14 : 12}
        borderStyle={theme.borders.style}
        borderColor={theme.colors.borderFocused}
        flexDirection="column"
        padding={theme.spacing.xs}
      >
        <box flexDirection="row">
          <text fg={theme.colors.primary}>{title}</text>
        </box>

        <box flexDirection="row" marginTop={theme.spacing.xs}>
          <text fg={theme.colors.text.secondary}>{getActionDescription()}</text>
        </box>

        <box flexDirection="row" marginTop={theme.spacing.xs}>
          <text fg={theme.colors.text.muted}>Commit: </text>
          <text fg={theme.colors.git.modified}>{commitHash} </text>
          <text fg={theme.colors.text.secondary}>{commitMessage}</text>
        </box>

        {requiresInput && (
          <>
            <box flexDirection="row" marginTop={theme.spacing.xs}>
              <text fg={theme.colors.text.primary}>{inputLabel}</text>
            </box>
            <box
              flexDirection="row"
              borderStyle={theme.borders.style}
              borderColor={theme.colors.border}
              padding={theme.spacing.none}
              paddingLeft={theme.spacing.xs}
              marginTop={theme.spacing.xs}
            >
              <text fg={theme.colors.text.primary}>{input || inputPlaceholder}</text>
            </box>
          </>
        )}

        {children}

        <box flexDirection="row" marginTop={theme.spacing.xs}>
          <text fg={theme.colors.text.muted}>Press </text>
          <text fg={theme.colors.primary}>Enter</text>
          <text fg={theme.colors.text.muted}> to confirm, </text>
          <text fg={theme.colors.primary}>ESC</text>
          <text fg={theme.colors.text.muted}> to cancel</text>
        </box>
      </box>
    </box>
  );
}
