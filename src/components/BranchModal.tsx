import { useState, useCallback } from 'react'
import { useKeyboard } from '@opentui/react'
import { theme } from '../theme'
import { Modal } from './Modal'
import { Input } from './Input'

interface BranchModalProps {
  onCreateBranch: (name: string, startPoint?: string) => void
  onCancel: () => void
  currentCommit?: string
}

export function BranchModal({ onCreateBranch, onCancel, currentCommit }: BranchModalProps) {
  const [branchName, setBranchName] = useState('')
  const [startPoint, setStartPoint] = useState('')
  const [focusedField, setFocusedField] = useState<'name' | 'startPoint'>('name')

  const handleSubmit = useCallback(() => {
    if (branchName.trim()) {
      const trimmedStartPoint = startPoint.trim()
      onCreateBranch(branchName.trim(), trimmedStartPoint || undefined)
      setBranchName('')
      setStartPoint('')
    }
  }, [branchName, startPoint, onCreateBranch])

  useKeyboard((key) => {
    if (key.name === 'escape') {
      onCancel()
    } else if (key.name === 'tab') {
      // Tab to switch between fields
      if (focusedField === 'name') {
        setFocusedField('startPoint')
      } else {
        setFocusedField('name')
      }
    }
  })

  return (
    <Modal
      width={80}
      height={16}
      title="Create New Branch"
    >
      {/* Branch name */}
      <text fg={theme.colors.text.muted}>Branch name:</text>
      <Input
        width={76}
        placeholder="feature/my-new-feature"
        value={branchName}
        onInput={(value) => setBranchName(value)}
        onSubmit={handleSubmit}
        focused={focusedField === 'name'}
      />
      
      <text> </text>
      
      {/* Start point */}
      <text fg={theme.colors.text.muted}>
        Start point (optional):
      </text>
      <Input
        width={76}
        placeholder={currentCommit ? `Leave empty for HEAD (${currentCommit})` : 'Leave empty for HEAD'}
        value={startPoint}
        onInput={(value) => setStartPoint(value)}
        onSubmit={handleSubmit}
        focused={focusedField === 'startPoint'}
      />
      
      <text> </text>
      
      {/* Help text */}
      <box 
        borderStyle={theme.borders.style} 
        borderColor={theme.colors.border} 
        padding={theme.spacing.none}
      >
        <text fg={theme.colors.text.muted}>
          [Tab] Switch Fields | [Enter] Create | [Esc] Cancel
        </text>
      </box>
    </Modal>
  )
}
