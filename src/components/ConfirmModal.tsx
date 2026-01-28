import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { theme } from '../theme';
import { Modal } from './Modal';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmModal({
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmModalProps) {
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

  const borderColor = danger ? theme.colors.status.error : theme.colors.status.warning;
  const titleColor = danger ? theme.colors.status.error : theme.colors.status.warning;

  return (
    <Modal width={60} height={10} title={title} borderColor={borderColor}>
      <box style={{ justifyContent: 'center' }}>
        <text fg={theme.colors.text.muted}>{message}</text>
      </box>
      <box style={{ marginTop: 1, justifyContent: 'center', flexDirection: 'row', gap: 3 }}>
        <text
          bg={selectedOption === 'confirm' ? borderColor : theme.colors.background.button}
          fg={
            selectedOption === 'confirm' ? theme.colors.text.inverted : theme.colors.text.disabled
          }
        >
          {selectedOption === 'confirm' ? `[✓ ${confirmText}]` : `  ${confirmText}  `}
        </text>
        <text
          bg={
            selectedOption === 'cancel' ? theme.colors.status.info : theme.colors.background.button
          }
          fg={selectedOption === 'cancel' ? theme.colors.text.primary : theme.colors.text.disabled}
        >
          {selectedOption === 'cancel' ? `[✓ ${cancelText}]` : `  ${cancelText}  `}
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
