import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { theme } from '../theme';
import { Modal } from './Modal';

interface PublishBranchModalProps {
  branch: string;
  remote: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PublishBranchModal({
  branch,
  remote,
  onConfirm,
  onCancel,
}: PublishBranchModalProps) {
  const [selectedOption, setSelectedOption] = useState<'confirm' | 'cancel'>('confirm');

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
    <Modal width={70} height={15} title="Publish Branch" borderColor={theme.colors.status.warning}>
      <box flexDirection="column" width="100%" height="100%">
        {/* Message */}
        <box flexDirection="column" width="100%" gap={1}>
          <text fg={theme.colors.text.secondary}>
            Branch "{branch}" has no upstream branch configured.
          </text>
          <text fg={theme.colors.text.muted}>
            Publish this branch to "{remote}" and set it as upstream?
          </text>
        </box>

        {/* Command preview */}
        <box
          flexDirection="column"
          width="100%"
          marginTop={1}
          borderStyle={theme.borders.style}
          borderColor={theme.colors.border}
          paddingLeft={1}
          height={3}
        >
          <text fg={theme.colors.text.disabled}>
            git push --set-upstream {remote} {branch}
          </text>
        </box>

        {/* Buttons */}
        <box flexDirection="row" width="100%" justifyContent="center" marginTop={1} gap={3}>
          <text
            bg={
              selectedOption === 'confirm'
                ? theme.colors.status.success
                : theme.colors.background.button
            }
            fg={
              selectedOption === 'confirm' ? theme.colors.text.inverted : theme.colors.text.disabled
            }
          >
            {selectedOption === 'confirm' ? '[✓ Publish]' : '  Publish  '}
          </text>
          <text
            bg={
              selectedOption === 'cancel'
                ? theme.colors.status.info
                : theme.colors.background.button
            }
            fg={
              selectedOption === 'cancel' ? theme.colors.text.primary : theme.colors.text.disabled
            }
          >
            {selectedOption === 'cancel' ? '[✓ Cancel]' : '  Cancel  '}
          </text>
        </box>

        {/* Help text */}
        <box
          flexDirection="column"
          width="100%"
          marginTop={2}
          borderStyle={theme.borders.style}
          borderColor={theme.colors.background.buttonHover}
          paddingLeft={1}
          height={3}
        >
          <text fg={theme.colors.text.disabled}>←→ select │ Enter confirm │ Y/N quick</text>
        </box>
      </box>
    </Modal>
  );
}
