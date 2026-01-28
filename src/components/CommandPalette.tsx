import { useState, useEffect, useRef } from 'react';
import { useKeyboard } from '@opentui/react';
import { ScrollBoxRenderable } from '@opentui/core';
import { theme } from '../theme';
import { Modal } from './Modal';
import { Input } from './Input';
import type { Command } from '../types/commands';

interface CommandPaletteProps {
  commands: Command[];
  onClose: () => void;
}

export function CommandPalette({ commands, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  // Filter commands based on search query, show all by default
  const filteredCommands =
    search.trim().length > 0
      ? commands.filter(
          (cmd) =>
            cmd.label.toLowerCase().includes(search.toLowerCase()) ||
            cmd.description.toLowerCase().includes(search.toLowerCase()),
        )
      : commands;

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Auto-scroll to selected item when selection changes
  useEffect(() => {
    if (!scrollRef.current || filteredCommands.length === 0) return;

    const itemHeight = 1;
    const scrollPosition = Math.max(0, selectedIndex * itemHeight - 2);
    scrollRef.current.scrollTo({ x: 0, y: scrollPosition });
  }, [selectedIndex, filteredCommands.length]);

  useKeyboard((key) => {
    if (key.name === 'escape') {
      onClose();
    } else if (key.name === 'up') {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.name === 'down') {
      setSelectedIndex((prev) => Math.min(filteredCommands.length - 1, prev + 1));
    } else if (key.name === 'return') {
      const cmd = filteredCommands[selectedIndex];
      if (cmd) {
        cmd.execute();
        onClose();
      }
    }
  });

  return (
    <Modal width={100} height={20} title="Command Palette">
      <box flexDirection="column" flexGrow={1}>
        <box marginBottom={1}>
          <Input
            value={search}
            onInput={setSearch}
            placeholder="Type to search commands..."
            focused={true}
            width={96}
          />
        </box>

        <scrollbox ref={scrollRef} width="100%" height={10} viewportCulling={true}>
          {filteredCommands.length === 0 ? (
            <text fg={theme.colors.text.muted}>No commands found</text>
          ) : (
            filteredCommands.map((cmd, index) => (
              <box key={cmd.id} flexDirection="row" height={1}>
                <text
                  fg={index === selectedIndex ? theme.colors.git.modified : theme.colors.text.muted}
                  width={2}
                >
                  {index === selectedIndex ? '>' : ' '}
                </text>
                <text
                  fg={index === selectedIndex ? theme.colors.text.primary : theme.colors.text.muted}
                  width={30}
                >
                  {cmd.label}
                </text>
                <text fg={theme.colors.text.disabled} width={38}>
                  {cmd.description}
                </text>
                {cmd.shortcut && (
                  <text fg={theme.colors.primary} width={26}>
                    {cmd.shortcut}
                  </text>
                )}
              </box>
            ))
          )}
        </scrollbox>
      </box>

      <box
        borderStyle={theme.borders.style}
        borderColor={theme.colors.border}
        padding={theme.spacing.none}
        marginTop={1}
      >
        <text fg={theme.colors.text.muted}>Up/Down: Navigate | Enter: Execute | ESC: Close</text>
      </box>
    </Modal>
  );
}
