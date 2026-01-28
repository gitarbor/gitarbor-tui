import { useState } from 'react';
import { useKeyboard } from '@opentui/react';
import { theme } from '../theme';
import type { WorkspaceSession } from '../types/workspace';

interface WorkspaceModalProps {
  sessions: WorkspaceSession[];
  activeSessionId?: string;
  onLoadSession: (sessionId: string) => void;
  onSaveSession: (name: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onClose: () => void;
}

export function WorkspaceModal({
  sessions,
  activeSessionId,
  onLoadSession,
  onSaveSession,
  onDeleteSession,
  onClose,
}: WorkspaceModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<'list' | 'save' | 'confirm'>('list');
  const [inputName, setInputName] = useState('');
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const maxIndex = sessions.length - 1;

  useKeyboard((key) => {
    if (mode === 'save') {
      if (key.name === 'escape') {
        setMode('list');
        setInputName('');
      } else if (key.name === 'return') {
        if (inputName.trim()) {
          onSaveSession(inputName.trim());
          setMode('list');
          setInputName('');
        }
      } else if (key.name === 'backspace') {
        setInputName((prev) => prev.slice(0, -1));
      } else if (key.sequence && key.sequence.length === 1 && key.sequence !== '/') {
        setInputName((prev) => prev + key.sequence);
      }
    } else if (mode === 'confirm') {
      if (key.name === 'escape' || key.sequence === 'n') {
        setMode('list');
        setSessionToDelete(null);
      } else if (key.sequence === 'y') {
        if (sessionToDelete) {
          onDeleteSession(sessionToDelete);
          setMode('list');
          setSessionToDelete(null);
          setSelectedIndex(Math.max(0, selectedIndex - 1));
        }
      }
    } else {
      if (key.name === 'escape' || key.sequence === 'q') {
        onClose();
      } else if (key.name === 'up') {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (key.name === 'down') {
        setSelectedIndex((prev) => Math.min(maxIndex, prev + 1));
      } else if (key.name === 'return') {
        const session = sessions[selectedIndex];
        if (session) {
          onLoadSession(session.id);
          onClose();
        }
      } else if (key.sequence === 's') {
        setMode('save');
      } else if (key.sequence === 'd') {
        const session = sessions[selectedIndex];
        if (session) {
          setSessionToDelete(session.id);
          setMode('confirm');
        }
      }
    }
  });

  return (
    <box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
      backgroundColor="rgba(0, 0, 0, 0.8)"
    >
      <box
        width="80%"
        maxWidth={80}
        flexDirection="column"
        borderStyle={theme.borders.style}
        borderColor={theme.colors.borderFocused}
        backgroundColor={theme.colors.background.primary}
        padding={theme.spacing.sm}
      >
        <text fg={theme.colors.primary}>Workspace Sessions</text>

        {mode === 'save' ? (
          <>
            <box marginTop={theme.spacing.xs} marginBottom={theme.spacing.xs}>
              <text fg={theme.colors.text.muted}>Enter session name (ESC to cancel)</text>
            </box>
            <box
              borderStyle={theme.borders.style}
              borderColor={theme.colors.borderFocused}
              padding={theme.spacing.xs}
              marginTop={theme.spacing.xs}
            >
              <text fg={theme.colors.text.primary}>{inputName || '_'}</text>
            </box>
          </>
        ) : mode === 'confirm' ? (
          <>
            <box marginTop={theme.spacing.sm} marginBottom={theme.spacing.sm}>
              <text fg={theme.colors.status.warning}>Delete this session? (y/n)</text>
            </box>
            <box paddingLeft={theme.spacing.sm}>
              <text fg={theme.colors.text.muted}>
                {sessions.find((s) => s.id === sessionToDelete)?.name}
              </text>
            </box>
          </>
        ) : (
          <>
            <box marginTop={theme.spacing.xs} marginBottom={theme.spacing.xs}>
              <text fg={theme.colors.text.muted}>
                s: save current | d: delete | Enter: load | ESC: cancel
              </text>
            </box>

            <box flexDirection="column" marginTop={theme.spacing.xs}>
              {sessions.length === 0 ? (
                <text fg={theme.colors.text.muted}>
                  No saved sessions. Press 's' to save current workspace.
                </text>
              ) : (
                sessions.map((session, index) => {
                  const isSelected = index === selectedIndex;
                  const isActive = session.id === activeSessionId;
                  const date = new Date(session.lastModified).toLocaleDateString();

                  return (
                    <box
                      key={session.id}
                      flexDirection="column"
                      paddingLeft={theme.spacing.xs}
                      paddingRight={theme.spacing.xs}
                      marginBottom={theme.spacing.xs}
                      backgroundColor={
                        isSelected
                          ? theme.colors.background.highlight
                          : theme.colors.background.primary
                      }
                    >
                      <box>
                        <text fg={isSelected ? theme.colors.primary : theme.colors.text.primary}>
                          {isActive ? '● ' : '  '}
                          {session.name}
                        </text>
                        <text fg={theme.colors.text.muted} marginLeft={theme.spacing.xs}>
                          ({session.repositories.length} repos)
                        </text>
                      </box>
                      <box paddingLeft={theme.spacing.sm}>
                        <text fg={theme.colors.text.muted}>Modified: {date}</text>
                      </box>
                    </box>
                  );
                })
              )}
            </box>
          </>
        )}
      </box>
    </box>
  );
}
