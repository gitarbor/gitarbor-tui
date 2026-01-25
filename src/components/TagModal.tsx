import { useState, useCallback } from 'react'
import { useKeyboard } from '@opentui/react'
import { theme } from '../theme'

interface TagModalProps {
  commitHash: string
  commitMessage: string
  onCreateTag: (tagName: string, message?: string) => void
  onCancel: () => void
}

export function TagModal({
  commitHash,
  commitMessage,
  onCreateTag,
  onCancel,
}: TagModalProps) {
  const [tagName, setTagName] = useState('')
  const [tagMessage, setTagMessage] = useState('')
  const [focusedField, setFocusedField] = useState<'name' | 'message'>('name')

  const handleKeyPress = useCallback(
    (key: { name?: string; sequence?: string; ctrl?: boolean }) => {
      if (key.name === 'escape') {
        onCancel()
      } else if (key.name === 'return') {
        if (tagName.trim()) {
          onCreateTag(tagName, tagMessage || undefined)
        }
      } else if (key.name === 'tab') {
        setFocusedField((prev) => (prev === 'name' ? 'message' : 'name'))
      } else if (key.name === 'backspace') {
        if (focusedField === 'name') {
          setTagName((prev) => prev.slice(0, -1))
        } else {
          setTagMessage((prev) => prev.slice(0, -1))
        }
      } else if (key.sequence && key.sequence.length === 1 && !key.ctrl) {
        if (focusedField === 'name') {
          setTagName((prev) => prev + key.sequence)
        } else {
          setTagMessage((prev) => prev + key.sequence)
        }
      }
    },
    [onCancel, onCreateTag, tagName, tagMessage, focusedField]
  )

  useKeyboard(handleKeyPress)

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
        height={18}
        borderStyle={theme.borders.style}
        borderColor={theme.colors.borderFocused}
        flexDirection="column"
        padding={theme.spacing.xs}
      >
        <box flexDirection="row">
          <text fg={theme.colors.primary}>Create Tag</text>
        </box>

        <box flexDirection="row" marginTop={theme.spacing.xs}>
          <text fg={theme.colors.text.muted}>Commit: </text>
          <text fg={theme.colors.git.modified}>{commitHash} </text>
          <text fg={theme.colors.text.secondary}>{commitMessage}</text>
        </box>

        <box flexDirection="row" marginTop={theme.spacing.xs}>
          <text fg={focusedField === 'name' ? theme.colors.primary : theme.colors.text.secondary}>
            Tag name:
          </text>
        </box>
        <box
          flexDirection="row"
          borderStyle={theme.borders.style}
          borderColor={focusedField === 'name' ? theme.colors.borderFocused : theme.colors.border}
          padding={theme.spacing.none}
          paddingLeft={theme.spacing.xs}
        >
          <text fg={theme.colors.text.primary}>
            {tagName || (focusedField === 'name' ? '' : 'v1.0.0')}
          </text>
        </box>

        <box flexDirection="row" marginTop={theme.spacing.xs}>
          <text fg={focusedField === 'message' ? theme.colors.primary : theme.colors.text.secondary}>
            Tag message (optional):
          </text>
        </box>
        <box
          flexDirection="row"
          borderStyle={theme.borders.style}
          borderColor={focusedField === 'message' ? theme.colors.borderFocused : theme.colors.border}
          padding={theme.spacing.none}
          paddingLeft={theme.spacing.xs}
        >
          <text fg={theme.colors.text.primary}>
            {tagMessage || (focusedField === 'message' ? '' : 'Release notes...')}
          </text>
        </box>

        <box flexDirection="row" marginTop={theme.spacing.xs}>
          <text fg={theme.colors.text.muted}>
            Use </text>
          <text fg={theme.colors.primary}>Tab</text>
          <text fg={theme.colors.text.muted}> to switch fields, </text>
          <text fg={theme.colors.primary}>Enter</text>
          <text fg={theme.colors.text.muted}> to create, </text>
          <text fg={theme.colors.primary}>ESC</text>
          <text fg={theme.colors.text.muted}> to cancel</text>
        </box>
      </box>
    </box>
  )
}
