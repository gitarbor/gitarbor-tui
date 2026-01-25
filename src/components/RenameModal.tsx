import { useState, useCallback } from 'react'
import { useKeyboard } from '@opentui/react'
import { theme } from '../theme'

interface RenameModalProps {
  currentPath: string
  onRename: (newPath: string) => void
  onCancel: () => void
}

export function RenameModal({ currentPath, onRename, onCancel }: RenameModalProps) {
  const [newPath, setNewPath] = useState(currentPath)

  const handleSubmit = useCallback(() => {
    if (newPath.trim() && newPath !== currentPath) {
      onRename(newPath.trim())
    }
  }, [newPath, currentPath, onRename])

  useKeyboard((key) => {
    if (key.name === 'escape') {
      onCancel()
    }
  })

  return (
    <box
      style={{
        position: 'absolute',
        left: 10,
        top: 5,
        zIndex: 1000,
      }}
      width={80}
      height={12}
      backgroundColor={theme.colors.background.modal}
      borderStyle="double"
      borderColor={theme.colors.primary}
      padding={theme.spacing.xs}
      flexDirection="column"
    >
      <text fg={theme.colors.primary}>Rename/Move File</text>
      <text> </text>
      
      {/* Current path */}
      <text fg={theme.colors.text.muted}>Current path:</text>
      <text fg={theme.colors.text.secondary}>{currentPath}</text>
      
      <text> </text>
      
      {/* New path */}
      <text fg={theme.colors.text.muted}>New path:</text>
      <input
        width={76}
        placeholder="Enter new path"
        value={newPath}
        onInput={(value) => setNewPath(value)}
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
          [Enter] Rename | [Esc] Cancel
        </text>
      </box>
    </box>
  )
}
