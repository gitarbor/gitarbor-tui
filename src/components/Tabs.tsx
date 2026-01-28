import { theme } from '../theme';
import type { View } from '../types/git';

interface TabsProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

export function Tabs({ activeView, onViewChange }: TabsProps) {
  const tabs: Array<{ id: View; label: string; key: string }> = [
    { id: 'main', label: 'Main', key: '1' },
    { id: 'log', label: 'History', key: '2' },
    { id: 'diff', label: 'Diff', key: '3' },
    { id: 'stash', label: 'Stash', key: '4' },
    { id: 'remotes', label: 'Remotes', key: '5' },
    { id: 'repos', label: 'Repos', key: '6' },
  ];

  return (
    <box width="100%" height={1} flexDirection="row" paddingLeft={theme.spacing.xs}>
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeView;
        const separator = index < tabs.length - 1 ? ' │ ' : '';

        return (
          <box key={tab.id} flexDirection="row">
            <text fg={isActive ? theme.colors.primary : theme.colors.text.muted}>
              {tab.key}. {tab.label}
            </text>
            {separator && <text fg={theme.colors.border}>{separator}</text>}
          </box>
        );
      })}
    </box>
  );
}
