import { theme } from '../theme'
import type { GitStash } from '../types/git'

interface StashViewProps {
  stashes: GitStash[]
  selectedIndex: number
  focused: boolean
}

export function StashView({ stashes, selectedIndex, focused }: StashViewProps) {
  return (
    <box
      width="100%"
      flexGrow={1}
      borderStyle={theme.borders.style}
      borderColor={focused ? theme.colors.borderFocused : theme.colors.border}
      padding={theme.spacing.none}
    >
      <box paddingLeft={theme.spacing.xs} paddingTop={theme.spacing.none}>
        <text fg={theme.colors.text.primary}>Stash List</text>
        <text> </text>
        <text fg={theme.colors.text.muted}>
          Press Enter to apply, Shift+P to pop, Shift+D to drop, Shift+V to view diff
        </text>
        <text> </text>
        {stashes.length === 0 ? (
          <text fg={theme.colors.text.muted}>No stashes saved</text>
        ) : (
          stashes.map((stash, idx) => {
            const isSelected = idx === selectedIndex
            
            return (
              <box key={stash.name} flexDirection="row">
                <text fg={isSelected ? theme.colors.primary : theme.colors.border}>
                  {isSelected ? '>' : ' '}
                </text>
                <text fg={theme.colors.git.modified}> {stash.name} </text>
                <text fg={theme.colors.text.muted}>on </text>
                <text fg={theme.colors.status.info}>{stash.branch}</text>
                <text fg={theme.colors.text.muted}> - </text>
                <text fg={isSelected ? theme.colors.text.primary : theme.colors.text.secondary}>
                  {stash.message}
                </text>
              </box>
            )
          })
        )}
      </box>
    </box>
  )
}
