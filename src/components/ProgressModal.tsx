import { useEffect, useCallback } from 'react'
import { useKeyboard } from '@opentui/react'
import { theme } from '../theme'
import { Modal } from './Modal'

interface ProgressModalProps {
  title: string
  messages: string[]
  isComplete: boolean
  error?: string
  onClose: () => void
}

export function ProgressModal({ title, messages, isComplete, error, onClose }: ProgressModalProps) {
  // Auto-close on success after a short delay
  useEffect(() => {
    if (isComplete && !error) {
      const timer = setTimeout(() => {
        onClose()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isComplete, error, onClose])

  const handleKeyPress = useCallback(() => {
    if (isComplete || error) {
      onClose()
    }
  }, [isComplete, error, onClose])

  useKeyboard((key) => {
    if (key.name === 'escape' || key.name === 'return') {
      handleKeyPress()
    }
  })

  // Show last 10 messages
  const visibleMessages = messages.slice(-10)

  return (
    <Modal
      width={80}
      height={15}
      title={title}
      borderColor={error ? theme.colors.status.error : theme.colors.primary}
    >
      <box flexDirection="column" flexGrow={1}>
        {visibleMessages.map((msg, idx) => (
          <text key={idx} fg={theme.colors.text.secondary}>{msg}</text>
        ))}
      </box>

      <text> </text>
      {error && (
        <>
          <text fg={theme.colors.status.error}>Error: {error}</text>
          <text> </text>
        </>
      )}
      
      {isComplete && !error && (
        <text fg={theme.colors.status.success}>Complete!</text>
      )}
      
      {!isComplete && !error && (
        <text fg={theme.colors.text.muted}>Please wait...</text>
      )}
      
      {(isComplete || error) && (
        <text fg={theme.colors.text.muted}>[Enter/Esc] Close</text>
      )}
    </Modal>
  )
}
