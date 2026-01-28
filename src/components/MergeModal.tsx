import { useState } from 'react';
import { useKeyboard } from '@opentui/react';
import { theme } from '../theme';
import type { GitBranch, MergeStrategy } from '../types/git';

interface MergeModalProps {
  branches: GitBranch[];
  currentBranch: string;
  onMerge: (branch: string, strategy: MergeStrategy) => void;
  onCancel: () => void;
}

export function MergeModal({ branches, currentBranch, onMerge, onCancel }: MergeModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [strategyIndex, setStrategyIndex] = useState(0);
  const [focusedField, setFocusedField] = useState<'branch' | 'strategy'>('branch');

  const strategies: { value: MergeStrategy; label: string; description: string }[] = [
    {
      value: 'default',
      label: 'Default',
      description: 'Fast-forward if possible, otherwise create merge commit',
    },
    { value: 'no-ff', label: 'No Fast-Forward', description: 'Always create a merge commit' },
    {
      value: 'ff-only',
      label: 'Fast-Forward Only',
      description: 'Only merge if fast-forward is possible',
    },
  ];

  // Filter out current branch and remote branches
  const availableBranches = branches.filter((b) => !b.remote && b.name !== currentBranch);

  useKeyboard((key) => {
    if (key.name === 'escape') {
      onCancel();
    } else if (key.name === 'tab') {
      setFocusedField(focusedField === 'branch' ? 'strategy' : 'branch');
    } else if (key.name === 'up') {
      if (focusedField === 'branch') {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else {
        setStrategyIndex((prev) => Math.max(0, prev - 1));
      }
    } else if (key.name === 'down') {
      if (focusedField === 'branch') {
        setSelectedIndex((prev) => Math.min(availableBranches.length - 1, prev + 1));
      } else {
        setStrategyIndex((prev) => Math.min(strategies.length - 1, prev + 1));
      }
    } else if (key.name === 'return') {
      const selectedBranch = availableBranches[selectedIndex];
      const selectedStrategy = strategies[strategyIndex];
      if (selectedBranch && selectedStrategy) {
        onMerge(selectedBranch.name, selectedStrategy.value);
      }
    }
  });

  if (availableBranches.length === 0) {
    return (
      <box
        position="absolute"
        left="50%"
        top="50%"
        width={60}
        height={9}
        marginLeft={-30}
        marginTop={-4}
        borderStyle={theme.borders.style}
        borderColor={theme.colors.borderFocused}
        backgroundColor={theme.colors.background.primary}
        padding={theme.spacing.xs}
        flexDirection="column"
      >
        <text fg={theme.colors.primary}>No Branches to Merge</text>
        <box height={1} />
        <text fg={theme.colors.text.secondary}>
          There are no available branches to merge into {currentBranch}.
        </text>
        <box height={1} />
        <text fg={theme.colors.text.muted}>Press ESC to close</text>
      </box>
    );
  }

  const selectedBranch = availableBranches[selectedIndex];
  const selectedStrategy = strategies[strategyIndex];

  return (
    <box
      position="absolute"
      left="50%"
      top="50%"
      width={70}
      height={Math.min(25, 14 + availableBranches.length)}
      marginLeft={-35}
      marginTop={Math.min(-12, -(7 + Math.floor(availableBranches.length / 2)))}
      borderStyle={theme.borders.style}
      borderColor={theme.colors.borderFocused}
      backgroundColor={theme.colors.background.primary}
      padding={theme.spacing.xs}
      flexDirection="column"
    >
      <text fg={theme.colors.primary}>Merge Branch into {currentBranch}</text>
      <box height={1} />

      <text fg={theme.colors.text.secondary}>Select branch to merge (Tab to switch fields):</text>
      <box height={1} />

      <box
        borderStyle={theme.borders.style}
        borderColor={focusedField === 'branch' ? theme.colors.borderFocused : theme.colors.border}
        padding={theme.spacing.xs}
        height={Math.min(10, availableBranches.length + 2)}
      >
        {availableBranches.map((branch, idx) => (
          <box key={branch.name} flexDirection="row">
            <text fg={idx === selectedIndex ? theme.colors.primary : theme.colors.border}>
              {idx === selectedIndex ? '>' : ' '}
            </text>
            <text
              fg={idx === selectedIndex ? theme.colors.text.primary : theme.colors.text.secondary}
            >
              {' '}
              {branch.name}
            </text>
            {branch.upstream && <text fg={theme.colors.text.muted}> → {branch.upstream}</text>}
          </box>
        ))}
      </box>

      <box height={1} />
      <text fg={theme.colors.text.secondary}>Merge strategy:</text>
      <box height={1} />

      <box
        borderStyle={theme.borders.style}
        borderColor={focusedField === 'strategy' ? theme.colors.borderFocused : theme.colors.border}
        padding={theme.spacing.xs}
        height={5}
      >
        {strategies.map((strategy, idx) => (
          <box key={strategy.value} flexDirection="row">
            <text fg={idx === strategyIndex ? theme.colors.primary : theme.colors.border}>
              {idx === strategyIndex ? '>' : ' '}
            </text>
            <text
              fg={idx === strategyIndex ? theme.colors.text.primary : theme.colors.text.secondary}
            >
              {' '}
              {strategy.label}
            </text>
          </box>
        ))}
      </box>

      {selectedStrategy && (
        <>
          <box height={1} />
          <text fg={theme.colors.text.muted}>{selectedStrategy.description}</text>
        </>
      )}

      <box height={1} />
      <text fg={theme.colors.text.muted}>Enter: Merge | Tab: Switch field | ESC: Cancel</text>
    </box>
  );
}
