import { theme } from '../theme'
import type { GitStash } from '../types/git'

interface StashSelectorProps {
  stash: GitStash
  focused: boolean
}

export function StashSelector({
  stash,
  focused,
}: StashSelectorProps) {
  return (
    <box width="100%" height="100%" flexDirection="column">
      <box flexDirection="column" paddingLeft={theme.spacing.xs}>
        <box flexDirection="row">
          <text fg={focused ? theme.colors.primary : theme.colors.border}>
            {focused ? '>' : ' '}
          </text>
          <text fg={theme.colors.git.modified}> {stash.name} </text>
          <text fg={theme.colors.text.muted}>({stash.branch})</text>
        </box>
        <box flexDirection="row" paddingLeft={theme.spacing.md}>
          <text fg={focused ? theme.colors.text.primary : theme.colors.text.secondary}>
            {stash.message.length > 50 ? stash.message.substring(0, 47) + '...' : stash.message}
          </text>
        </box>
      </box>
    </box>
  )
}
