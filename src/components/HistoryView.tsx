import { theme } from '../theme';
import { Fieldset } from './Fieldset';
import type { GitCommit } from '../types/git';

interface HistoryViewProps {
  commits: GitCommit[];
  selectedIndex: number;
  focused: boolean;
}

export function HistoryView({ commits, selectedIndex, focused }: HistoryViewProps) {
  return (
    <Fieldset
      title="Commit History"
      focused={focused}
      flexGrow={1}
      paddingX={theme.spacing.none}
      paddingY={theme.spacing.none}
    >
      <scrollbox width="100%" flexGrow={1} scrollY={true} paddingLeft={theme.spacing.xs}>
        {commits.length === 0 ? (
          <text fg={theme.colors.text.muted}>No commits</text>
        ) : (
          commits.map((commit, idx) => {
            const isSelected = idx === selectedIndex;

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
            );
          })
        )}
      </scrollbox>
    </Fieldset>
  );
}
