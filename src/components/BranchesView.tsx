import { theme } from '../theme';
import type { GitBranch } from '../types/git';

interface BranchesViewProps {
  branches: GitBranch[];
  selectedIndex: number;
  focused: boolean;
}

export function BranchesView({ branches, selectedIndex, focused }: BranchesViewProps) {
  const localBranches = branches.filter((b) => !b.remote);
  const remoteBranches = branches.filter((b) => b.remote);

  return (
    <box
      width="100%"
      flexGrow={1}
      borderStyle={theme.borders.style}
      borderColor={focused ? theme.colors.borderFocused : theme.colors.border}
      padding={theme.spacing.none}
    >
      <box paddingLeft={theme.spacing.xs} paddingTop={theme.spacing.none}>
        <text fg={theme.colors.text.primary}>Branches</text>
        <text> </text>
        <text fg={theme.colors.git.staged}>Local:</text>
        {localBranches.map((branch, idx) => {
          const isSelected = idx === selectedIndex;

          return (
            <box key={branch.name} flexDirection="column">
              <box flexDirection="row">
                <text fg={isSelected ? theme.colors.primary : theme.colors.border}>
                  {isSelected ? '>' : ' '}
                </text>
                <text fg={branch.current ? theme.colors.git.staged : theme.colors.text.secondary}>
                  {branch.current ? '* ' : '  '}
                  {branch.name}
                </text>
                {branch.lastCommitDate && (
                  <>
                    <text> </text>
                    <text fg={theme.colors.text.muted}>({branch.lastCommitDate})</text>
                  </>
                )}
              </box>
              {branch.upstream && (
                <box flexDirection="row" paddingLeft={theme.spacing.md}>
                  <text fg={theme.colors.text.muted}>↑ {branch.upstream}</text>
                </box>
              )}
              {branch.description && (
                <box flexDirection="row" paddingLeft={theme.spacing.md}>
                  <text fg={theme.colors.status.info}>ℹ {branch.description}</text>
                </box>
              )}
            </box>
          );
        })}
        <text> </text>
        <text fg={theme.colors.status.info}>Remote:</text>
        {remoteBranches.slice(0, 10).map((branch) => {
          return (
            <box key={branch.name} flexDirection="row">
              <text fg={theme.colors.text.muted}> {branch.name}</text>
            </box>
          );
        })}
      </box>
    </box>
  );
}
