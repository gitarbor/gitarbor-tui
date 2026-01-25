import { useState, useCallback } from 'react'
import { useKeyboard } from '@opentui/react'
import { theme } from '../theme'
import { Modal } from './Modal'
import { Input } from './Input'

interface BranchRenameModalProps {
  currentName: string
  onRenameBranch: (oldName: string, newName: string) => void
  onCancel: () => void
}

export function BranchRenameModal({ currentName, onRenameBranch, onCancel }: BranchRenameModalProps) {
  const [newName, setNewName] = useState(currentName)

  const handleSubmit = useCallback(() => {
    if (newName.trim() && newName.trim() !== currentName) {
      onRenameBranch(currentName, newName.trim())
      setNewName('')
    }
  }, [newName, currentName, onRenameBranch])

  useKeyboard((key) => {
    if (key.name === 'escape') {
      onCancel()
    }
  })

  return (
    <Modal
      width={80}
      height={12}
      title="Rename Branch"
    >
      <text fg={theme.colors.text.muted}>
        Current: <text fg={theme.colors.text.primary}>{currentName}</text>
      </text>
      <text> </text>
      
      <text fg={theme.colors.text.muted}>New name:</text>
      <Input
        width={76}
        placeholder="new-branch-name"
        value={newName}
        onInput={(value) => setNewName(value)}
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
    </Modal>
  )
}
