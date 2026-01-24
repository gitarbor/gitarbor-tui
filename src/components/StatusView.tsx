import { theme } from '../theme'
import type { GitFile } from '../types/git'

interface StatusViewProps {
  staged: GitFile[]
  unstaged: GitFile[]
  untracked: GitFile[]
  selectedIndex: number
  focused: boolean
  onStage: (path: string) => void
  onUnstage: (path: string) => void
}

export function StatusView({
  staged,
  unstaged,
  untracked,
  selectedIndex,
  focused,
}: StatusViewProps) {
  const allFiles = [
    ...staged.map((f) => ({ ...f, section: 'staged' })),
    ...unstaged.map((f) => ({ ...f, section: 'unstaged' })),
    ...untracked.map((f) => ({ ...f, section: 'untracked' })),
  ]

  const getStatusSymbol = (status: string, section: string) => {
    if (section === 'staged') return '✓'
    if (section === 'untracked') return '?'
    switch (status) {
      case 'M': return '~'
      case 'D': return '-'
      case 'A': return '+'
      default: return '•'
    }
  }

  const getSectionColor = (section: string) => {
    if (section === 'staged') return theme.colors.git.staged
    if (section === 'untracked') return theme.colors.text.muted
    return theme.colors.git.modified
  }

  return (
    <box
      width="100%"
      flexGrow={1}
      borderStyle={theme.borders.style}
      borderColor={focused ? theme.colors.borderFocused : theme.colors.border}
      padding={theme.spacing.none}
    >
      <box paddingLeft={theme.spacing.xs} paddingTop={theme.spacing.none}>
        <text fg={theme.colors.text.primary}>Working Directory Status</text>
        <text> </text>
        {allFiles.length === 0 ? (
          <text fg={theme.colors.text.muted}>No changes</text>
        ) : (
          allFiles.map((file, idx) => {
            const isSelected = idx === selectedIndex
            const symbol = getStatusSymbol(file.status, file.section)
            const color = getSectionColor(file.section)
            
            return (
              <box key={file.path} flexDirection="row">
                <text fg={isSelected ? theme.colors.primary : theme.colors.border}>
                  {isSelected ? '>' : ' '}
                </text>
                <text fg={color}> {symbol} </text>
                <text fg={isSelected ? theme.colors.text.primary : theme.colors.text.secondary}>
                  {file.path}
                </text>
                <text fg={theme.colors.text.muted}> ({file.section})</text>
              </box>
            )
          })
        )}
      </box>
    </box>
  )
}
