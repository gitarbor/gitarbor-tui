import { theme } from '../theme';
import { Fieldset } from './Fieldset';
import type { GitStash } from '../types/git';

interface StashSelectorProps {
  stashes: GitStash[];
  selectedIndex: number;
  focused: boolean;
}

export function StashSelector({ stashes, selectedIndex, focused }: StashSelectorProps) {
  if (stashes.length === 0) {
    return null;
  }

  // Show the selected stash when focused, otherwise show the most recent stash (index 0)
  const stash = focused && stashes[selectedIndex] ? stashes[selectedIndex]! : stashes[0]!;

  return (
    <Fieldset
      title="Stashes (h)"
      focused={focused}
      height={4}
      paddingX={theme.spacing.none}
      paddingY={theme.spacing.none}
    >
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
    </Fieldset>
  );
}
