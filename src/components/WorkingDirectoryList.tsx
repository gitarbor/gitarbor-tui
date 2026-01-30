import { useEffect, useRef, useMemo, memo } from 'react';
import { ScrollBoxRenderable } from '@opentui/core';
import { theme } from '../theme';
import type { GitFile, GitMergeState } from '../types/git';

interface WorkingDirectoryListProps {
  allFiles: Array<GitFile & { section: string }>;
  selectedIndex: number;
  isFocused: boolean;
  mergeState?: GitMergeState;
}

// Helper functions moved outside component to avoid recreation
const getStatusPrefix = (file: GitFile & { section: string }) => {
  // Check actual git status first
  if (file.status === 'D') return 'D';
  if (file.status === 'A') return 'A';

  // Fall back to section-based logic
  if (file.section === 'untracked') return 'U';
  return 'M';
};

const getSectionColor = (section: string, status: string) => {
  // Prioritize section color (staged files should always be green)
  if (section === 'staged') return theme.colors.git.staged;
  if (section === 'untracked') return theme.colors.text.muted;
  // Only show deleted color for unstaged deleted files
  if (status === 'D') return theme.colors.git.deleted;
  return theme.colors.git.modified;
};

// Memoized file item component to prevent unnecessary re-renders
interface FileItemProps {
  file: GitFile & { section: string };
  isSelected: boolean;
  prefix: string;
  color: string;
}

const FileItem = memo(({ file, isSelected, prefix, color }: FileItemProps) => {
  const lastSlashIndex = file.path.lastIndexOf('/');
  const fileName = lastSlashIndex >= 0 ? file.path.slice(lastSlashIndex + 1) : file.path;
  const dirPath = lastSlashIndex >= 0 ? file.path.slice(0, lastSlashIndex) : '';

  return (
    <box key={file.path} flexDirection="row" paddingLeft={theme.spacing.xs} height={1}>
      <text
        fg={isSelected ? theme.colors.primary : theme.colors.border}
        width={2}
      >
        {isSelected ? '>' : ' '} 
      </text>
      <text fg={color} width={3}>
        {prefix}  
      </text>
      <text
        fg={isSelected ? theme.colors.text.primary : theme.colors.text.secondary}
        flexShrink={0}
      >
        {fileName}
      </text>
      {dirPath && (
        <text fg={theme.colors.text.muted}>
          {' '}{dirPath}
        </text>
      )}
    </box>
  );
});

FileItem.displayName = 'FileItem';

export function WorkingDirectoryList({
  allFiles,
  selectedIndex,
  isFocused,
  mergeState,
}: WorkingDirectoryListProps) {
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  // Auto-scroll to selected item when selection changes
  useEffect(() => {
    if (!isFocused || !scrollRef.current) return;

    const itemHeight = 1;
    const scrollPosition = Math.max(0, selectedIndex * itemHeight - 2);
    scrollRef.current.scrollTo({ x: 0, y: scrollPosition });
  }, [selectedIndex, isFocused]);

  // Memoize file items to prevent re-calculating on every render
  const fileItems = useMemo(() => {
    return allFiles.map((file, idx) => ({
      file,
      idx,
      prefix: getStatusPrefix(file),
      color: getSectionColor(file.section, file.status),
    }));
  }, [allFiles]);

  return (
    <>
      {mergeState?.inProgress && (
        <box
          borderStyle={theme.borders.style}
          borderColor={theme.colors.status.warning}
          padding={theme.spacing.xs}
          marginBottom={theme.spacing.xs}
          marginLeft={theme.spacing.xs}
          marginRight={theme.spacing.xs}
        >
          <text fg={theme.colors.status.warning}>⚠ MERGE IN PROGRESS</text>
          <text> </text>
          {mergeState.mergingBranch && (
            <text fg={theme.colors.text.secondary}>
              Merging '{mergeState.mergingBranch}' into '{mergeState.currentBranch}'
            </text>
          )}
          <text> </text>
          {mergeState.conflicts.length > 0 && (
            <text fg={theme.colors.status.error}>
              {mergeState.conflicts.length} conflict{mergeState.conflicts.length !== 1 ? 's' : ''} -
              Press 'C' to resolve
            </text>
          )}
          {mergeState.conflicts.length === 0 && (
            <text fg={theme.colors.git.staged}>All conflicts resolved - ready to commit</text>
          )}
        </box>
      )}

      {allFiles.length === 0 ? (
        <box paddingLeft={theme.spacing.xs}>
          <text fg={theme.colors.text.muted}>Working directory clean</text>
        </box>
      ) : (
        <scrollbox ref={scrollRef} width="100%" height="100%" viewportCulling={true}>
          {fileItems.map((item) => (
            <FileItem
              key={item.file.path}
              file={item.file}
              isSelected={item.idx === selectedIndex && isFocused}
              prefix={item.prefix}
              color={item.color}
            />
          ))}
        </scrollbox>
      )}
    </>
  );
}
