import { theme } from '../theme'
import { Fieldset } from './Fieldset'
import type { GitStash } from '../types/git'

interface StashViewProps {
  stashes: GitStash[]
  selectedIndex: number
  focused: boolean
}

export function StashView({ stashes, selectedIndex, focused }: StashViewProps) {
  return (
    <Fieldset
      title="Stash List"
      focused={focused}
      flexGrow={1}
      paddingX={theme.spacing.xs}
      paddingY={theme.spacing.none}
    >
      <box flexDirection="column">
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
    </Fieldset>
  )
}
