import { useState } from 'react'
import { useKeyboard } from '@opentui/react'
import { theme } from '../theme'
import type { Repository } from '../types/workspace'

interface RepositorySwitcherModalProps {
  repositories: Repository[]
  recentRepositories: Repository[]
  onSelectRepository: (repository: Repository) => void
  onAddRepository: (path: string) => void
  onClose: () => void
}

export function RepositorySwitcherModal({
  repositories,
  recentRepositories,
  onSelectRepository,
  onAddRepository,
  onClose,
}: RepositorySwitcherModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [inputMode, setInputMode] = useState(false)
  const [inputPath, setInputPath] = useState('')

  // Combine current repositories and recent ones (excluding duplicates)
  const allRepos = [
    ...repositories,
    ...recentRepositories.filter(
      (recent) => !repositories.find((r) => r.path === recent.path)
    ),
  ]

  const maxIndex = inputMode ? 0 : allRepos.length - 1

  useKeyboard((key) => {
    if (inputMode) {
      if (key.name === 'escape') {
        setInputMode(false)
        setInputPath('')
      } else if (key.name === 'return') {
        if (inputPath.trim()) {
          onAddRepository(inputPath.trim())
          onClose()
        }
      } else if (key.name === 'backspace') {
        setInputPath((prev) => prev.slice(0, -1))
      } else if (key.sequence && key.sequence.length === 1) {
        setInputPath((prev) => prev + key.sequence)
      }
    } else {
      if (key.name === 'escape' || key.sequence === 'q') {
        onClose()
      } else if (key.name === 'up') {
        setSelectedIndex((prev) => Math.max(0, prev - 1))
      } else if (key.name === 'down') {
        setSelectedIndex((prev) => Math.min(maxIndex, prev + 1))
      } else if (key.name === 'return') {
        const repo = allRepos[selectedIndex]
        if (repo) {
          onSelectRepository(repo)
          onClose()
        }
      } else if (key.sequence === 'n') {
        setInputMode(true)
      }
    }
  })

  return (
    <box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
      backgroundColor="rgba(0, 0, 0, 0.8)"
    >
      <box
        width="80%"
        maxWidth={80}
        flexDirection="column"
        borderStyle={theme.borders.style}
        borderColor={theme.colors.borderFocused}
        backgroundColor={theme.colors.background.primary}
        padding={theme.spacing.sm}
      >
        <text fg={theme.colors.primary}>
          Repository Switcher
        </text>
        
        <box marginTop={theme.spacing.xs} marginBottom={theme.spacing.xs}>
          <text fg={theme.colors.text.muted}>
            {inputMode
              ? 'Enter repository path (ESC to cancel)'
              : 'Select repository (n: add new, ESC: cancel)'}
          </text>
        </box>

        {inputMode ? (
          <box
            borderStyle={theme.borders.style}
            borderColor={theme.colors.borderFocused}
            padding={theme.spacing.xs}
            marginTop={theme.spacing.xs}
          >
            <text fg={theme.colors.text.primary}>
              {inputPath || '_'}
            </text>
          </box>
        ) : (
          <box flexDirection="column" marginTop={theme.spacing.xs}>
            {allRepos.length === 0 ? (
              <text fg={theme.colors.text.muted}>No repositories. Press 'n' to add one.</text>
            ) : (
              allRepos.map((repo, index) => {
                const isSelected = index === selectedIndex
                const isCurrent = repositories.find((r) => r.id === repo.id)

                return (
                  <box
                    key={repo.id}
                    paddingLeft={theme.spacing.xs}
                    paddingRight={theme.spacing.xs}
                    backgroundColor={
                      isSelected
                        ? theme.colors.background.highlight
                        : theme.colors.background.primary
                    }
                  >
                    <text
                      fg={
                        isSelected
                          ? theme.colors.primary
                          : theme.colors.text.primary
                      }
                    >
                      {isCurrent ? '● ' : '  '}
                      {repo.name}
                    </text>
                    <text
                      fg={theme.colors.text.muted}
                      marginLeft={theme.spacing.xs}
                    >
                      - {repo.path}
                    </text>
                  </box>
                )
              })
            )}
          </box>
        )}

        <box marginTop={theme.spacing.sm}>
          <text fg={theme.colors.text.muted}>
            {inputMode
              ? ''
              : `${allRepos.length} repositories (${repositories.length} open)`}
          </text>
        </box>
      </box>
    </box>
  )
}
