import { theme } from '../theme'
import type { GitCommit } from '../types/git'

interface LogViewProps {
  commits: GitCommit[]
  selectedIndex: number
  focused: boolean
}

export function LogView({ commits, selectedIndex, focused }: LogViewProps) {
  return (
    <box
      width="100%"
      flexGrow={1}
      borderStyle={theme.borders.style}
      borderColor={focused ? theme.colors.borderFocused : theme.colors.border}
      padding={theme.spacing.none}
    >
      <box paddingLeft={theme.spacing.xs} paddingTop={theme.spacing.none}>
        <text fg={theme.colors.text.primary}>Commit History</text>
        <text> </text>
        {commits.length === 0 ? (
          <text fg={theme.colors.text.muted}>No commits</text>
        ) : (
          commits.map((commit, idx) => {
            const isSelected = idx === selectedIndex
            
            return (
              <box key={commit.hash} flexDirection="row">
                <text fg={isSelected ? theme.colors.primary : theme.colors.border}>
                  {isSelected ? '>' : ' '}
                </text>
                <text fg={theme.colors.git.modified}> {commit.shortHash} </text>
                <text fg={theme.colors.text.muted}>{commit.date}</text>
                <text fg={theme.colors.text.muted}> - </text>
                <text fg={theme.colors.status.info}>{commit.author}</text>
                <text fg={theme.colors.text.muted}> - </text>
                <text fg={isSelected ? theme.colors.text.primary : theme.colors.text.secondary}>
                  {commit.message}
                </text>
              </box>
            )
          })
        )}
      </box>
    </box>
  )
}
