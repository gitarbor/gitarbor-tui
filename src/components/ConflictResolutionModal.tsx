import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { theme } from '../theme';
import type { GitConflict } from '../types/git';

interface ConflictResolutionModalProps {
  conflicts: GitConflict[];
  currentBranch: string;
  mergingBranch: string;
  onResolve: (path: string, resolution: 'ours' | 'theirs' | 'manual') => Promise<void>;
  onEditConflict: (path: string, content: string) => Promise<void>;
  onStageResolved: (path: string) => Promise<void>;
  onAbort: () => void;
  onContinue: (message: string) => void;
  onClose: () => void;
}

export function ConflictResolutionModal({
  conflicts,
  currentBranch,
  mergingBranch,
  onResolve,
  onEditConflict,
  onStageResolved,
  onAbort,
  onContinue,
  onClose,
}: ConflictResolutionModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [commitMessage, setCommitMessage] = useState(
    `Merge branch '${mergingBranch}' into ${currentBranch}`,
  );
  const [editingMessage, setEditingMessage] = useState(false);

  const selectedConflict = conflicts[selectedIndex];

  const handleResolve = useCallback(
    async (resolution: 'ours' | 'theirs') => {
      if (selectedConflict) {
        await onResolve(selectedConflict.path, resolution);
      }
    },
    [selectedConflict, onResolve],
  );

  const handleStage = useCallback(async () => {
    if (selectedConflict) {
      await onStageResolved(selectedConflict.path);
    }
  }, [selectedConflict, onStageResolved]);

  useKeyboard((key) => {
    if (editingMessage) {
      if (key.name === 'escape') {
        setEditingMessage(false);
      } else if (key.name === 'return') {
        setEditingMessage(false);
        if (conflicts.length === 0) {
          onContinue(commitMessage);
        }
      } else if (key.name === 'backspace') {
        setCommitMessage((prev) => prev.slice(0, -1));
      } else if (key.sequence && key.sequence.length === 1) {
        setCommitMessage((prev) => prev + key.sequence);
      }
      return;
    }

    if (key.name === 'escape') {
      if (viewMode === 'detail') {
        setViewMode('list');
      } else {
        onClose();
      }
    } else if (key.name === 'up') {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.name === 'down') {
      setSelectedIndex((prev) => Math.min(conflicts.length - 1, prev + 1));
    } else if (key.name === 'return') {
      if (viewMode === 'list') {
        setViewMode('detail');
      }
    } else if (key.sequence === 'o') {
      void handleResolve('ours');
    } else if (key.sequence === 't') {
      void handleResolve('theirs');
    } else if (key.sequence === 's') {
      void handleStage();
    } else if (key.sequence === 'a') {
      onAbort();
    } else if (key.sequence === 'c') {
      if (conflicts.length === 0) {
        setEditingMessage(true);
      }
    } else if (key.sequence === 'v') {
      if (viewMode === 'list') {
        setViewMode('detail');
      } else {
        setViewMode('list');
      }
    }
  });

  if (conflicts.length === 0) {
    return (
      <box
        position="absolute"
        left="50%"
        top="50%"
        width={70}
        height={12}
        marginLeft={-35}
        marginTop={-6}
        borderStyle={theme.borders.style}
        borderColor={theme.colors.borderFocused}
        backgroundColor={theme.colors.background.primary}
        padding={theme.spacing.xs}
        flexDirection="column"
      >
        <text fg={theme.colors.git.staged}>All Conflicts Resolved!</text>
        <box height={1} />
        <text fg={theme.colors.text.secondary}>
          All merge conflicts have been resolved. Ready to commit.
        </text>
        <box height={1} />

        <text fg={theme.colors.text.secondary}>Commit message:</text>
        <box
          borderStyle={theme.borders.style}
          borderColor={editingMessage ? theme.colors.borderFocused : theme.colors.border}
          padding={theme.spacing.xs}
        >
          <text fg={theme.colors.text.primary}>{commitMessage || '(enter message)'}</text>
        </box>

        <box height={1} />
        <text fg={theme.colors.text.muted}>
          {editingMessage
            ? 'Type message, Enter: Save | ESC: Cancel'
            : 'c: Edit message | Enter: Commit merge | a: Abort | ESC: Close'}
        </text>
      </box>
    );
  }

  if (viewMode === 'detail' && selectedConflict) {
    const previewLines = selectedConflict.ours.split('\n').slice(0, 10);
    const theirsLines = selectedConflict.theirs.split('\n').slice(0, 10);

    return (
      <box
        position="absolute"
        left="50%"
        top="50%"
        width={80}
        height={30}
        marginLeft={-40}
        marginTop={-15}
        borderStyle={theme.borders.style}
        borderColor={theme.colors.borderFocused}
        backgroundColor={theme.colors.background.primary}
        padding={theme.spacing.xs}
        flexDirection="column"
      >
        <text fg={theme.colors.primary}>Conflict Details: {selectedConflict.path}</text>
        <box height={1} />

        <box flexDirection="row" flexGrow={1}>
          <box
            width="50%"
            borderStyle={theme.borders.style}
            borderColor={theme.colors.border}
            padding={theme.spacing.xs}
            flexDirection="column"
          >
            <text fg={theme.colors.git.staged}>Ours ({currentBranch})</text>
            <box height={1} />
            {previewLines.map((line, idx) => (
              <text key={idx} fg={theme.colors.text.secondary}>
                {line || ' '}
              </text>
            ))}
            {selectedConflict.ours.split('\n').length > 10 && (
              <text fg={theme.colors.text.muted}>
                ... ({selectedConflict.ours.split('\n').length - 10} more lines)
              </text>
            )}
          </box>

          <box width={2} />

          <box
            width="50%"
            borderStyle={theme.borders.style}
            borderColor={theme.colors.border}
            padding={theme.spacing.xs}
            flexDirection="column"
          >
            <text fg={theme.colors.git.modified}>Theirs ({mergingBranch})</text>
            <box height={1} />
            {theirsLines.map((line, idx) => (
              <text key={idx} fg={theme.colors.text.secondary}>
                {line || ' '}
              </text>
            ))}
            {selectedConflict.theirs.split('\n').length > 10 && (
              <text fg={theme.colors.text.muted}>
                ... ({selectedConflict.theirs.split('\n').length - 10} more lines)
              </text>
            )}
          </box>
        </box>

        <box height={1} />
        <text fg={theme.colors.text.muted}>
          o: Use ours | t: Use theirs | s: Stage (manual edit) | ESC: Back
        </text>
      </box>
    );
  }

  return (
    <box
      position="absolute"
      left="50%"
      top="50%"
      width={70}
      height={Math.min(20, 10 + conflicts.length)}
      marginLeft={-35}
      marginTop={Math.min(-10, -(5 + Math.floor(conflicts.length / 2)))}
      borderStyle={theme.borders.style}
      borderColor={theme.colors.borderFocused}
      backgroundColor={theme.colors.background.primary}
      padding={theme.spacing.xs}
      flexDirection="column"
    >
      <text fg={theme.colors.status.warning}>Merge Conflicts ({conflicts.length})</text>
      <box height={1} />
      <text fg={theme.colors.text.secondary}>
        Merging '{mergingBranch}' into '{currentBranch}'
      </text>
      <box height={1} />

      <box
        borderStyle={theme.borders.style}
        borderColor={theme.colors.border}
        padding={theme.spacing.xs}
        flexGrow={1}
      >
        {conflicts.map((conflict, idx) => (
          <box key={conflict.path} flexDirection="row">
            <text fg={idx === selectedIndex ? theme.colors.primary : theme.colors.border}>
              {idx === selectedIndex ? '>' : ' '}
            </text>
            <text fg={theme.colors.status.error}> ⚠ </text>
            <text
              fg={idx === selectedIndex ? theme.colors.text.primary : theme.colors.text.secondary}
            >
              {conflict.path}
            </text>
            <text fg={theme.colors.text.muted}>
              {' '}
              ({conflict.conflictMarkers.length} conflict
              {conflict.conflictMarkers.length !== 1 ? 's' : ''})
            </text>
          </box>
        ))}
      </box>

      <box height={1} />
      <text fg={theme.colors.text.muted}>
        Enter/v: View details | o: Use ours | t: Use theirs | s: Stage | a: Abort | ESC: Close
      </text>
    </box>
  );
}
