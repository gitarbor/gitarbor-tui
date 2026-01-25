import { theme } from '../theme'
import type { CommandLogEntry } from '../types/git'

interface CommandLogViewProps {
  commandLog: CommandLogEntry[]
  maxHeight?: number
}

export function CommandLogView({ commandLog, maxHeight = 10 }: CommandLogViewProps) {
  const formatTimestamp = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  const formatDuration = (ms: number): string => {
    if (ms < 1000) {
      return `${ms}ms`
    }
    return `${(ms / 1000).toFixed(2)}s`
  }

  const displayEntries = commandLog.slice(0, maxHeight)

  return (
    <box
      width="100%"
      height={maxHeight + 3}
      borderStyle={theme.borders.style}
      borderColor={theme.colors.border}
      padding={theme.spacing.none}
      flexDirection="column"
    >
      <box paddingLeft={theme.spacing.xs} paddingTop={theme.spacing.none}>
        <text fg={theme.colors.text.primary}>Command Log</text>
        <text fg={theme.colors.text.muted}> (last {commandLog.length} commands)</text>
      </box>
      
      <box flexDirection="column" paddingLeft={theme.spacing.xs}>
        {displayEntries.length === 0 ? (
          <text fg={theme.colors.text.muted}>No commands executed yet</text>
        ) : (
          displayEntries.map((entry, idx) => (
            <box key={idx} flexDirection="row">
              <text fg={theme.colors.text.muted}>
                [{formatTimestamp(entry.timestamp)}]
              </text>
              <text> </text>
              <text fg={entry.success ? theme.colors.status.success : theme.colors.status.error}>
                {entry.success ? '✓' : '✗'}
              </text>
              <text> </text>
              <text fg={theme.colors.text.secondary}>
                {entry.command}
              </text>
              <text> </text>
              <text fg={theme.colors.text.muted}>
                ({formatDuration(entry.duration)})
              </text>
            </box>
          ))
        )}
      </box>
    </box>
  )
}
