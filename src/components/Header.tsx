import { theme } from '../theme';
import { Tabs } from './Tabs';
import type { View } from '../types/git';
import packageJson from '../../package.json';

interface HeaderProps {
  branch: string;
  ahead: number;
  behind: number;
  view: View;
  onViewChange: (view: View) => void;
}

export function Header({ branch, ahead, behind, view, onViewChange }: HeaderProps) {
  const aheadBehind = ahead > 0 || behind > 0 ? ` [↑${ahead} ↓${behind}]` : '';

  return (
    <box
      width="100%"
      height={4}
      borderStyle={theme.borders.style}
      borderColor={theme.colors.border}
      padding={theme.spacing.none}
    >
      <box flexDirection="row" paddingLeft={theme.spacing.xs} paddingTop={theme.spacing.none}>
        <text fg={theme.colors.primary}>GitArbor v{packageJson.version}</text>
        <text fg={theme.colors.text.muted}> - </text>
        <text fg={theme.colors.git.modified}>{branch}</text>
        <text fg={theme.colors.text.muted}>{aheadBehind}</text>
      </box>
      <Tabs activeView={view} onViewChange={onViewChange} />
    </box>
  );
}
