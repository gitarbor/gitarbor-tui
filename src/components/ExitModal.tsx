import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { theme } from '../theme';
import { Modal } from './Modal';

interface ExitModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ExitModal({ onConfirm, onCancel }: ExitModalProps) {
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no'>('no');

  const handleKeyboard = useCallback(
    (key: { name: string; sequence?: string }) => {
      // Handle arrow keys for navigation
      if (key.name === 'left') {
        setSelectedOption('yes');
        return;
      }
      if (key.name === 'right') {
        setSelectedOption('no');
        return;
      }

      // Handle Enter to confirm selection
      if (key.name === 'return') {
        if (selectedOption === 'yes') {
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
    <Modal width={55} height={10} title="Exit GitArbor?" borderColor={theme.colors.status.info}>
      <box style={{ justifyContent: 'center' }}>
        <text fg={theme.colors.text.muted}>Are you sure you want to quit?</text>
      </box>
      <box style={{ marginTop: 1, justifyContent: 'center', flexDirection: 'row', gap: 3 }}>
        <text
          bg={selectedOption === 'yes' ? theme.colors.status.info : theme.colors.background.button}
          fg={selectedOption === 'yes' ? theme.colors.text.inverted : theme.colors.text.disabled}
        >
          {selectedOption === 'yes' ? '[✓ Yes]' : '  Yes  '}
        </text>
        <text
          bg={selectedOption === 'no' ? theme.colors.status.info : theme.colors.background.button}
          fg={selectedOption === 'no' ? theme.colors.text.primary : theme.colors.text.disabled}
        >
          {selectedOption === 'no' ? '[✓ No]' : '  No  '}
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
