import { useState, useCallback } from 'react'
import { useKeyboard } from '@opentui/react'
import { theme } from '../theme'

interface CommitModalProps {
  onCommit: (message: string) => void
  onCancel: () => void
}

export function CommitModal({ onCommit, onCancel }: CommitModalProps) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [focusedField, setFocusedField] = useState<'subject' | 'body'>('subject')
  const [showPreview, setShowPreview] = useState(false)

  const handleSubmit = useCallback(() => {
    if (subject.trim()) {
      // Format: subject + blank line + body (if body exists)
      const fullMessage = body.trim() 
        ? `${subject.trim()}\n\n${body.trim()}`
        : subject.trim()
      onCommit(fullMessage)
      setSubject('')
      setBody('')
    }
  }, [subject, body, onCommit])

  useKeyboard((key) => {
    if (key.name === 'escape') {
      onCancel()
    } else if (key.name === 'tab') {
      // Tab to switch between subject and body
      if (focusedField === 'subject') {
        setFocusedField('body')
      } else {
        setFocusedField('subject')
      }
    } else if (key.sequence === 'p' && key.ctrl) {
      // Ctrl+P to toggle preview
      setShowPreview((prev) => !prev)
    } else if (key.sequence === 's' && key.ctrl) {
      // Ctrl+S to submit (alternative to Ctrl+Enter)
      handleSubmit()
    }
  })

  const subjectLength = subject.length
  const subjectColor = subjectLength > 50 
    ? theme.colors.status.warning 
    : subjectLength > 72 
      ? theme.colors.status.error 
      : theme.colors.text.muted

  // Preview formatted commit message
  const previewMessage = body.trim() 
    ? `${subject.trim()}\n\n${body.trim()}`
    : subject.trim()

  const previewLines = previewMessage.split('\n').slice(0, 8) // Show first 8 lines

  if (showPreview) {
    return (
      <box
        style={{
          position: 'absolute',
          left: 10,
          top: 3,
          zIndex: 1000,
        }}
        width={80}
        height={20}
        backgroundColor={theme.colors.background.modal}
        borderStyle="double"
        borderColor={theme.colors.primary}
        padding={theme.spacing.xs}
        flexDirection="column"
      >
        <text fg={theme.colors.primary}>Commit Message Preview</text>
        <text> </text>
        
        <box
          borderStyle={theme.borders.style}
          borderColor={theme.colors.border}
          padding={theme.spacing.xs}
          flexGrow={1}
          flexDirection="column"
        >
          {previewLines.length > 0 ? (
            previewLines.map((line, idx) => (
              <text 
                key={idx} 
                fg={idx === 0 ? theme.colors.text.primary : theme.colors.text.secondary}
              >
                {line || ' '}
              </text>
            ))
          ) : (
            <text fg={theme.colors.text.muted}>(empty commit message)</text>
          )}
        </box>

        <text> </text>
        <text fg={theme.colors.text.muted}>
          [Ctrl+P] Back to Edit | [Ctrl+S] Commit | [Esc] Cancel
        </text>
      </box>
    )
  }

  return (
    <box
      style={{
        position: 'absolute',
        left: 10,
        top: 3,
        zIndex: 1000,
      }}
      width={80}
      height={20}
      backgroundColor={theme.colors.background.modal}
      borderStyle="double"
      borderColor={theme.colors.primary}
      padding={theme.spacing.xs}
      flexDirection="column"
    >
      <text fg={theme.colors.primary}>Create Commit</text>
      <text> </text>
      
      {/* Subject line */}
      <box flexDirection="row">
        <text fg={theme.colors.text.muted} width={10}>Subject:</text>
        <text fg={subjectColor}>({subjectLength}/50)</text>
      </box>
      <input
        width={76}
        placeholder="Brief description (50 chars recommended)"
        value={subject}
        onInput={(value) => setSubject(value)}
        onSubmit={handleSubmit}
        focused={focusedField === 'subject'}
      />
      
      <text> </text>
      
      {/* Body */}
      <text fg={theme.colors.text.muted}>Body (optional):</text>
      <input
        width={76}
        placeholder="Detailed explanation (press Tab to switch fields)"
        value={body}
        onInput={(value) => setBody(value)}
        onSubmit={handleSubmit}
        focused={focusedField === 'body'}
      />
      
      <text> </text>
      
      {/* Help text */}
      <box 
        borderStyle={theme.borders.style} 
        borderColor={theme.colors.border} 
        padding={theme.spacing.none}
      >
        <text fg={theme.colors.text.muted}>
          [Tab] Switch Fields | [Ctrl+Enter] Commit | [Ctrl+P] Preview | [Esc] Cancel
        </text>
      </box>
      
      <text> </text>
      
      {/* Info about subject line length convention */}
      {subjectLength > 50 && (
        <text fg={subjectLength > 72 ? theme.colors.status.error : theme.colors.status.warning}>
          {subjectLength > 72 
            ? '⚠ Subject line should be max 72 characters' 
            : 'ℹ Subject line over 50 chars (recommended limit)'}
        </text>
      )}
    </box>
  )
}
