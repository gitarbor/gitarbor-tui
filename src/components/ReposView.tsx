import { theme } from '../theme';
import { Fieldset } from './Fieldset';
import type { Repository } from '../types/workspace';

interface ReposViewProps {
  repos: Repository[];
  selectedIndex: number;
  focusedPanel: 'filter' | 'repos';
  filterQuery: string;
  onFilterChange: (query: string) => void;
}

export function ReposView({ repos, selectedIndex, focusedPanel, filterQuery }: ReposViewProps) {
  // Filter repos based on query
  const filteredRepos = filterQuery
    ? repos.filter(
        (repo) =>
          repo.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
          repo.path.toLowerCase().includes(filterQuery.toLowerCase()),
      )
    : repos;

  return (
    <box width="100%" height="100%" flexDirection="column">
      {/* Filter Panel */}
      <Fieldset
        title="Filter"
        focused={focusedPanel === 'filter'}
        paddingX={theme.spacing.xs}
        paddingY={theme.spacing.xs}
      >
        <box flexDirection="row">
          <text fg={theme.colors.text.muted}>Search: </text>
          <text fg={filterQuery ? theme.colors.primary : theme.colors.text.muted}>
            {filterQuery || '(type to filter repositories)'}
          </text>
        </box>
      </Fieldset>

      {/* Repositories Panel */}
      <Fieldset
        title={`Repositories${filterQuery ? ` (filtered: ${filteredRepos.length}/${repos.length})` : ` (${repos.length})`}`}
        focused={focusedPanel === 'repos'}
        flexGrow={1}
        paddingX={theme.spacing.xs}
        paddingY={theme.spacing.none}
      >
        <box flexDirection="column">
          {filteredRepos.length === 0 ? (
            <text fg={theme.colors.text.muted}>
              {filterQuery
                ? 'No repositories match your filter'
                : 'No repositories in history. Open a repository to add it.'}
            </text>
          ) : (
            filteredRepos.map((repo, idx) => {
              const isSelected = idx === selectedIndex;
              const lastAccessedDate = new Date(repo.lastAccessed);
              const now = new Date();
              const diffMs = now.getTime() - lastAccessedDate.getTime();
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMs / 3600000);
              const diffDays = Math.floor(diffMs / 86400000);

              let timeAgo = '';
              if (diffMins < 1) {
                timeAgo = 'just now';
              } else if (diffMins < 60) {
                timeAgo = `${diffMins}m ago`;
              } else if (diffHours < 24) {
                timeAgo = `${diffHours}h ago`;
              } else if (diffDays < 30) {
                timeAgo = `${diffDays}d ago`;
              } else {
                timeAgo = lastAccessedDate.toLocaleDateString();
              }

              return (
                <box key={repo.path} flexDirection="row" paddingBottom={theme.spacing.none}>
                  <text fg={isSelected ? theme.colors.primary : theme.colors.border}>
                    {isSelected ? '>' : ' '}
                  </text>
                  <text fg={isSelected ? theme.colors.primary : theme.colors.text.primary}>
                    {' '}
                    {repo.name}{' '}
                  </text>
                  <text fg={theme.colors.text.muted}>({timeAgo})</text>
                </box>
              );
            })
          )}
        </box>
      </Fieldset>
    </box>
  );
}
