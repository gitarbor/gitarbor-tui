import { useState, useCallback } from 'react'
import { useKeyboard } from '@opentui/react'
import { theme } from '../theme'
import type { GitBranch } from '../types/git'

interface SetUpstreamModalProps {
  branch: string
  remoteBranches: GitBranch[]
  onSetUpstream: (branch: string, upstream: string) => void
  onCancel: () => void
}

export function SetUpstreamModal({ branch, remoteBranches, onSetUpstream, onCancel }: SetUpstreamModalProps) {
  const [upstream, setUpstream] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mode, setMode] = useState<'select' | 'manual'>('select')

  const handleSubmit = useCallback(() => {
    if (mode === 'manual' && upstream.trim()) {
      onSetUpstream(branch, upstream.trim())
    } else if (mode === 'select' && remoteBranches.length > 0) {
      const selected = remoteBranches[selectedIndex]
      if (selected) {
        onSetUpstream(branch, selected.name)
      }
    }
  }, [mode, upstream, branch, remoteBranches, selectedIndex, onSetUpstream])

  useKeyboard((key) => {
    if (key.name === 'escape') {
      onCancel()
    } else if (key.name === 'tab') {
      setMode(mode === 'select' ? 'manual' : 'select')
    } else if (mode === 'select') {
      if (key.name === 'up') {
        setSelectedIndex((prev) => Math.max(0, prev - 1))
      } else if (key.name === 'down') {
        setSelectedIndex((prev) => Math.min(remoteBranches.length - 1, prev + 1))
      } else if (key.name === 'return') {
        handleSubmit()
      }
    }
  })

  return (
    <box
      style={{
        position: 'absolute',
        left: 10,
        top: 3,
        zIndex: 1000,
      }}
      width={80}
      height={22}
      backgroundColor={theme.colors.background.modal}
      borderStyle="double"
      borderColor={theme.colors.primary}
      padding={theme.spacing.xs}
      flexDirection="column"
    >
      <text fg={theme.colors.primary}>Set Upstream for: {branch}</text>
      <text> </text>
      
      {mode === 'select' ? (
        <>
          <text fg={theme.colors.text.muted}>Select remote branch:</text>
          <box
            borderStyle={theme.borders.style}
            borderColor={theme.colors.border}
            padding={theme.spacing.xs}
            height={12}
            flexDirection="column"
          >
            {remoteBranches.length > 0 ? (
              remoteBranches.slice(0, 10).map((remoteBranch, idx) => (
                <text 
                  key={remoteBranch.name}
                  fg={idx === selectedIndex ? theme.colors.primary : theme.colors.text.secondary}
                >
                  {idx === selectedIndex ? '> ' : '  '}
                  {remoteBranch.name}
                </text>
              ))
            ) : (
              <text fg={theme.colors.text.muted}>No remote branches available</text>
            )}
          </box>
        </>
      ) : (
        <>
          <text fg={theme.colors.text.muted}>Enter upstream manually:</text>
          <input
            width={76}
            placeholder="origin/main"
            value={upstream}
            onInput={(value) => setUpstream(value)}
            onSubmit={handleSubmit}
            focused={true}
          />
        </>
      )}
      
      <text> </text>
      
      {/* Help text */}
      <box 
        borderStyle={theme.borders.style} 
        borderColor={theme.colors.border} 
        padding={theme.spacing.none}
      >
        <text fg={theme.colors.text.muted}>
          [Tab] Switch Mode | [↑/↓] Navigate | [Enter] Set | [Esc] Cancel
        </text>
      </box>
    </box>
  )
}
