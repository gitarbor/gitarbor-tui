import { useState, useCallback } from 'react'
import { useKeyboard } from '@opentui/react'
import { theme } from '../theme'
import { Modal } from './Modal'
import { Input } from './Input'

interface StashModalProps {
  onStash: (message: string) => void
  onCancel: () => void
}

export function StashModal({ onStash, onCancel }: StashModalProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = useCallback(() => {
    // Allow creating stash with or without a message
    onStash(message.trim())
    setMessage('')
  }, [message, onStash])

  useKeyboard((key) => {
    if (key.name === 'escape') {
      onCancel()
    }
  })

  return (
    <Modal
      width={80}
      height={12}
      title="Create Stash"
    >
      <text fg={theme.colors.text.muted}>
        Stash your working directory changes to save them for later.
      </text>
      <text> </text>
      
      {/* Message input */}
      <text fg={theme.colors.text.muted}>Message (optional):</text>
      <Input
        width={76}
        placeholder="Description of stashed changes"
        value={message}
        onInput={(value) => setMessage(value)}
        onSubmit={handleSubmit}
        focused={true}
      />
      
      <text> </text>
      
      {/* Help text */}
      <box 
        borderStyle={theme.borders.style} 
        borderColor={theme.colors.border} 
        padding={theme.spacing.none}
      >
        <text fg={theme.colors.text.muted}>
          [Enter] Create Stash | [Esc] Cancel
        </text>
      </box>
    </Modal>
  )
}
