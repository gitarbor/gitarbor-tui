import { useRef, useEffect } from 'react';
import { useKeyboard } from '@opentui/react';
import { ScrollBoxRenderable } from '@opentui/core';
import { theme } from '../theme';
import { Modal } from './Modal';

interface KeyboardShortcutsModalProps {
  onClose: () => void;
}

interface ShortcutSection {
  title: string;
  shortcuts: Array<{ keys: string; description: string }>;
}

const shortcutSections: ShortcutSection[] = [
  {
    title: 'General',
    shortcuts: [
      { keys: 'Ctrl+C / q', description: 'Quit application' },
      { keys: 'Shift+?', description: 'Show keyboard shortcuts' },
      { keys: 'Ctrl+P', description: 'Open command palette' },
      { keys: 'Ctrl+R', description: 'Refresh data' },
      { keys: '`', description: 'Toggle activity log' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: '↑/k', description: 'Move selection up' },
      { keys: '↓/j', description: 'Move selection down' },
      { keys: 'Tab', description: 'Cycle through panels' },
      { keys: 'Shift+Tab', description: 'Cycle panels backward' },
      { keys: '[', description: 'Previous tab' },
      { keys: ']', description: 'Next tab' },
    ],
  },
  {
    title: 'Views',
    shortcuts: [
      { keys: '1', description: 'Main view' },
      { keys: '2', description: 'History view' },
      { keys: '3', description: 'Diff view' },
      { keys: '4', description: 'Stash view' },
      { keys: '5', description: 'Remotes view' },
      { keys: '6', description: 'Repos view' },
    ],
  },
  {
    title: 'Panels',
    shortcuts: [
      { keys: 'w', description: 'Focus working directory' },
      { keys: 'b', description: 'Focus branches' },
      { keys: 'l', description: 'Focus commits' },
      { keys: 'h', description: 'Focus stashes' },
      { keys: 'v', description: 'Focus diff' },
    ],
  },
  {
    title: 'Working Directory',
    shortcuts: [
      { keys: 'Space', description: 'Stage/unstage file' },
      { keys: 'a', description: 'Stage all changes' },
      { keys: 'A', description: 'Unstage all changes' },
      { keys: 'c', description: 'Commit staged changes' },
      { keys: 'd', description: 'Discard changes / delete untracked' },
      { keys: 'D', description: 'Delete untracked file' },
      { keys: 'r', description: 'Rename/move file' },
      { keys: 's', description: 'Create stash' },
    ],
  },
  {
    title: 'Branches',
    shortcuts: [
      { keys: 'Enter', description: 'Checkout branch' },
      { keys: 'n', description: 'Create new branch' },
      { keys: 'D', description: 'Delete branch' },
      { keys: 'R', description: 'Rename branch' },
      { keys: 'u', description: 'Set upstream' },
      { keys: 'U', description: 'Unset upstream' },
      { keys: 'm', description: 'Merge branch' },
    ],
  },
  {
    title: 'Commits',
    shortcuts: [
      { keys: 'Enter', description: 'View commit diff' },
      { keys: 'y', description: 'Cherry-pick commit' },
      { keys: 'Shift+R', description: 'Revert commit' },
      { keys: 'Ctrl+T', description: 'Create tag at commit' },
      { keys: 'Shift+C', description: 'Copy commit hash' },
      { keys: 'Ctrl+A', description: 'Amend last commit' },
      { keys: 'Ctrl+X', description: 'Reset to commit' },
    ],
  },
  {
    title: 'Stashes',
    shortcuts: [
      { keys: 'Enter', description: 'View stash diff' },
      { keys: 'Space', description: 'Apply stash' },
      { keys: 'p', description: 'Pop stash' },
      { keys: 'd', description: 'Drop stash' },
    ],
  },
  {
    title: 'Remotes',
    shortcuts: [
      { keys: 'P', description: 'Push changes' },
      { keys: 'p', description: 'Pull changes' },
      { keys: 'f', description: 'Fetch from remotes' },
      { keys: 'n', description: 'Add new remote' },
      { keys: 'e', description: 'Edit remote' },
      { keys: 'd', description: 'Remove remote' },
    ],
  },
  {
    title: 'Merge Conflicts',
    shortcuts: [
      { keys: 'C', description: 'Open conflict resolution' },
      { keys: 'o', description: 'Accept ours' },
      { keys: 't', description: 'Accept theirs' },
      { keys: 'e', description: 'Edit manually' },
    ],
  },
];

export function KeyboardShortcutsModal({ onClose }: KeyboardShortcutsModalProps) {
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  useKeyboard((key) => {
    if (key.name === 'escape') {
      onClose();
    }
  });

  return (
    <Modal width={65} height={30} title="Keyboard Shortcuts">
      <scrollbox ref={scrollRef} width="100%" height={24} viewportCulling={true}>
        {shortcutSections.map((section, sectionIdx) => (
          <box key={section.title} flexDirection="column">
            {/* Section title */}
            <text fg={theme.colors.primary}>{section.title}</text>
            <text> </text>

            {/* Shortcuts in this section */}
            {section.shortcuts.map((shortcut, shortcutIdx) => (
              <box key={shortcutIdx} flexDirection="row" height={1}>
                <text fg={theme.colors.text.secondary} width={20}>
                  {shortcut.keys}
                </text>
                <text fg={theme.colors.text.primary}>{shortcut.description}</text>
              </box>
            ))}

            {/* Separator between sections */}
            {sectionIdx < shortcutSections.length - 1 && <text> </text>}
          </box>
        ))}
      </scrollbox>

      <text> </text>
      <text fg={theme.colors.text.muted}>[Esc] Close</text>
    </Modal>
  );
}
