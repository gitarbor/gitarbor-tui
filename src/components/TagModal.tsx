import { useState, useCallback } from 'react'
import { useKeyboard } from '@opentui/react'
import { theme } from '../theme'

interface TagModalProps {
  commitHash?: string
  commitMessage?: string
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

  const handleSubmit = useCallback(() => {
    if (tagName.trim()) {
      onCreateTag(tagName, tagMessage || undefined)
    }
  }, [tagName, tagMessage, onCreateTag])

  const handleKeyPress = useCallback(
    (key: { name?: string; sequence?: string; ctrl?: boolean }) => {
      if (key.name === 'escape') {
        onCancel()
      } else if (key.name === 'tab') {
        setFocusedField((prev) => (prev === 'name' ? 'message' : 'name'))
      }
    },
    [onCancel]
  )

  useKeyboard(handleKeyPress)

  return (
    <box
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -40,
        marginTop: -9,
        zIndex: 1000,
      }}
      width={80}
      height={18}
      backgroundColor={theme.colors.background.modal}
      borderStyle={theme.borders.style}
      borderColor={theme.colors.borderFocused}
      flexDirection="column"
      padding={theme.spacing.xs}
    >
      <box flexDirection="row">
        <text fg={theme.colors.primary}>Create Tag</text>
      </box>

      {commitHash && commitMessage && (
        <box flexDirection="row" marginTop={theme.spacing.xs}>
          <text fg={theme.colors.text.muted}>Commit: </text>
          <text fg={theme.colors.git.modified}>{commitHash} </text>
          <text fg={theme.colors.text.secondary}>{commitMessage}</text>
        </box>
      )}

      {!commitHash && (
        <box flexDirection="row" marginTop={theme.spacing.xs}>
          <text fg={theme.colors.text.muted}>Creating tag at current HEAD</text>
        </box>
      )}

      <box flexDirection="column" marginTop={theme.spacing.sm}>
        <text fg={theme.colors.text.secondary}>Tag name:</text>
        <input
          width="100%"
          value={tagName}
          onChange={setTagName}
          onSubmit={handleSubmit}
          placeholder="v1.0.0"
          focused={focusedField === 'name'}
          textColor={theme.colors.text.primary}
          backgroundColor={theme.colors.background.modal}
          focusedTextColor={theme.colors.text.primary}
          focusedBackgroundColor={theme.colors.background.modal}
          placeholderColor={theme.colors.text.muted}
          cursorColor={theme.colors.primary}
        />
      </box>

      <box flexDirection="column" marginTop={theme.spacing.sm}>
        <text fg={theme.colors.text.secondary}>Tag message (optional):</text>
        <input
          width="100%"
          value={tagMessage}
          onChange={setTagMessage}
          onSubmit={handleSubmit}
          placeholder="Release notes..."
          focused={focusedField === 'message'}
          textColor={theme.colors.text.primary}
          backgroundColor={theme.colors.background.modal}
          focusedTextColor={theme.colors.text.primary}
          focusedBackgroundColor={theme.colors.background.modal}
          placeholderColor={theme.colors.text.muted}
          cursorColor={theme.colors.primary}
        />
      </box>

      <box flexDirection="row" marginTop={theme.spacing.sm}>
        <text fg={theme.colors.text.muted}>
          [Tab] Switch Fields | [Enter] Create | [Esc] Cancel
        </text>
      </box>
    </box>
  )
}
