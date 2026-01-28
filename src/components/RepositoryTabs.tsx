import { theme } from '../theme';
import type { Repository } from '../types/workspace';

interface RepositoryTabsProps {
  repositories: Repository[];
  activeRepositoryId: string;
  onSelectRepository: (repositoryId: string) => void;
  onCloseRepository: (repositoryId: string) => void;
}

export function RepositoryTabs({
  repositories,
  activeRepositoryId,
  onSelectRepository,
  onCloseRepository,
}: RepositoryTabsProps) {
  if (repositories.length === 0) {
    return null;
  }

  return (
    <box
      width="100%"
      height={2}
      flexDirection="row"
      borderStyle={theme.borders.style}
      borderColor={theme.colors.border}
      backgroundColor={theme.colors.background.secondary}
    >
      <box width="100%" height={1} />
      {repositories.map((repo, index) => {
        const isActive = repo.id === activeRepositoryId;
        const isLast = index === repositories.length - 1;

        return (
          <box key={repo.id} flexDirection="row">
            <box
              flexDirection="row"
              paddingLeft={theme.spacing.sm}
              paddingRight={theme.spacing.sm}
              backgroundColor={
                isActive ? theme.colors.background.primary : theme.colors.background.secondary
              }
            >
              <text fg={isActive ? theme.colors.primary : theme.colors.text.secondary}>
                {repo.name}
              </text>
              {repositories.length > 1 && (
                <text fg={theme.colors.text.muted} marginLeft={theme.spacing.xs}>
                  ×
                </text>
              )}
            </box>
            {!isLast && <box width={1} backgroundColor={theme.colors.border} />}
          </box>
        );
      })}
      {repositories.length < 10 && (
        <box paddingLeft={theme.spacing.sm} paddingRight={theme.spacing.sm}>
          <text fg={theme.colors.text.muted}>+</text>
        </box>
      )}
    </box>
  );
}
