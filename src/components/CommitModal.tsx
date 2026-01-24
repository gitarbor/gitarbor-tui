import { useState, useCallback } from 'react'
import { theme } from '../theme'

interface CommitModalProps {
  onCommit: (message: string) => void
  onCancel: () => void
}

export function CommitModal({ onCommit, onCancel }: CommitModalProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = useCallback(() => {
    if (message.trim()) {
      onCommit(message)
      setMessage('')
    }
  }, [message, onCommit])

  return (
    <box
      style={{
        position: 'absolute',
        left: 10,
        top: 5,
        zIndex: 1000,
      }}
      width={60}
      height={8}
      backgroundColor={theme.colors.background.modal}
      borderStyle="double"
      borderColor={theme.colors.primary}
      padding={theme.spacing.xs}
    >
      <text fg={theme.colors.text.primary}>Create Commit</text>
      <text> </text>
      <text fg={theme.colors.text.muted}>Enter commit message:</text>
      <input
        width={56}
        placeholder="Commit message..."
        onInput={(value) => setMessage(value)}
        onSubmit={handleSubmit}
        focused={true}
      />
      <text> </text>
      <text fg={theme.colors.text.muted}>[Enter] Commit | [Esc] Cancel</text>
    </box>
  )
}
