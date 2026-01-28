import { theme } from '../theme';
import { Fieldset } from './Fieldset';
import type { ActivityLogEntry } from '../types/git';

interface ActivityLogProps {
  activityLog: ActivityLogEntry[];
  maxHeight?: number;
}

export function ActivityLog({ activityLog, maxHeight = 10 }: ActivityLogProps) {
  const formatTimestamp = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const displayEntries = activityLog.slice(0, maxHeight);

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'success':
        return theme.colors.status.success;
      case 'error':
        return theme.colors.status.error;
      case 'warning':
        return theme.colors.status.warning;
      case 'info':
        return theme.colors.status.info;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getLevelIcon = (level: string): string => {
    switch (level) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <Fieldset title="Activity Log (commands, errors, warnings)" height={maxHeight + 3} width="100%">
      <box flexDirection="column">
        {displayEntries.length === 0 ? (
          <text fg={theme.colors.text.muted}>No activity yet</text>
        ) : (
          displayEntries.map((entry, idx) => (
            <box key={idx} flexDirection="row">
              <text fg={theme.colors.text.muted}>[{formatTimestamp(entry.timestamp)}]</text>
              <text> </text>
              {entry.type === 'command' ? (
                <>
                  <text
                    fg={entry.success ? theme.colors.status.success : theme.colors.status.error}
                  >
                    {entry.success ? '✓' : '✗'}
                  </text>
                  <text> </text>
                  <text fg={theme.colors.text.secondary}>{entry.command}</text>
                  <text> </text>
                  <text fg={theme.colors.text.muted}>({formatDuration(entry.duration)})</text>
                </>
              ) : (
                <>
                  <text fg={getLevelColor(entry.level)}>{getLevelIcon(entry.level)}</text>
                  <text> </text>
                  <text fg={getLevelColor(entry.level)}>{entry.message}</text>
                </>
              )}
            </box>
          ))
        )}
      </box>
    </Fieldset>
  );
}
