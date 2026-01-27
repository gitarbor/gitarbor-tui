import { useState } from 'react'
import { useKeyboard } from '@opentui/react'
import { theme } from '../theme'

interface RepoSwitchModalProps {
  repoName: string
  stagedCount: number
  unstagedCount: number
  untrackedCount: number
  onConfirm: () => void
  onCancel: () => void
}

export function RepoSwitchModal({
  repoName,
  stagedCount,
  unstagedCount,
  untrackedCount,
  onConfirm,
  onCancel,
}: RepoSwitchModalProps) {
  const totalChanges = stagedCount + unstagedCount + untrackedCount

  useKeyboard((key) => {
    if (key.sequence === 'y' || key.sequence === 'Y' || key.name === 'return') {
      onConfirm()
    } else if (key.sequence === 'n' || key.sequence === 'N' || key.name === 'escape') {
      onCancel()
    }
  })

  return (
    <box
      position="absolute"
      top="50%"
      left="50%"
      marginTop={-8}
      marginLeft={-30}
      width={60}
      height={16}
      flexDirection="column"
      borderStyle={theme.borders.style}
      borderColor={theme.colors.status.warning}
      backgroundColor={theme.colors.background.primary}
      padding={theme.spacing.xs}
    >
      {/* Title */}
      <box flexDirection="row" paddingBottom={theme.spacing.xs}>
        <text fg={theme.colors.status.warning}>⚠ Uncommitted Changes</text>
      </box>

      {/* Message */}
      <box flexDirection="column" paddingBottom={theme.spacing.sm}>
        <text fg={theme.colors.text.primary}>
          You have {totalChanges} uncommitted change{totalChanges === 1 ? '' : 's'}:
        </text>
        <box paddingTop={theme.spacing.xs} paddingLeft={theme.spacing.sm}>
          {stagedCount > 0 && (
            <text fg={theme.colors.git.staged}>
              • {stagedCount} staged file{stagedCount === 1 ? '' : 's'}
            </text>
          )}
          {unstagedCount > 0 && (
            <text fg={theme.colors.git.modified}>
              • {unstagedCount} unstaged file{unstagedCount === 1 ? '' : 's'}
            </text>
          )}
          {untrackedCount > 0 && (
            <text fg={theme.colors.git.untracked}>
              • {untrackedCount} untracked file{untrackedCount === 1 ? '' : 's'}
            </text>
          )}
        </box>
        <box paddingTop={theme.spacing.sm}>
          <text fg={theme.colors.text.secondary}>
            Switch to "{repoName}" anyway?
          </text>
        </box>
        <box paddingTop={theme.spacing.xs}>
          <text fg={theme.colors.text.muted}>
            (Consider committing or stashing your changes first)
          </text>
        </box>
      </box>

      {/* Buttons */}
      <box flexDirection="row" paddingTop={theme.spacing.sm}>
        <box
          borderStyle={theme.borders.style}
          borderColor={theme.colors.status.warning}
          padding={theme.spacing.xs}
          marginRight={theme.spacing.sm}
        >
          <text fg={theme.colors.status.warning}>[Y]es, Switch</text>
        </box>
        <box
          borderStyle={theme.borders.style}
          borderColor={theme.colors.border}
          padding={theme.spacing.xs}
        >
          <text fg={theme.colors.text.muted}>[N]o, Cancel</text>
        </box>
      </box>
    </box>
  )
}
