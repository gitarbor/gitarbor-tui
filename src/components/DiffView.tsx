import { theme } from '../theme'

interface DiffViewProps {
  diff: string
  focused: boolean
}

export function DiffView({ diff, focused }: DiffViewProps) {
  const lines = diff.split('\n').slice(0, 100) // Limit to first 100 lines

  const getLineColor = (line: string): string => {
    if (line.startsWith('+')) return theme.colors.git.added
    if (line.startsWith('-')) return theme.colors.git.deleted
    if (line.startsWith('@@')) return theme.colors.status.info
    if (line.startsWith('diff') || line.startsWith('index')) return theme.colors.text.muted
    return theme.colors.text.secondary
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
        <text fg={theme.colors.text.primary}>Diff View</text>
        <text> </text>
        {!diff || diff.trim() === '' ? (
          <text fg={theme.colors.text.muted}>No changes to display</text>
        ) : (
          lines.map((line, idx) => (
            <text key={idx} fg={getLineColor(line)}>
              {line}
            </text>
          ))
        )}
      </box>
    </box>
  )
}
