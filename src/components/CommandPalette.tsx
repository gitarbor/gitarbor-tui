import { useState } from 'react'
import { useKeyboard } from '@opentui/react'
import { theme } from '../theme'
import type { Command } from '../types/commands'

interface CommandPaletteProps {
  commands: Command[]
  onClose: () => void
}

export function CommandPalette({ commands, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Only show commands if there's a search query
  const filteredCommands = search.trim().length > 0
    ? commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description.toLowerCase().includes(search.toLowerCase())
      )
    : []

  useKeyboard((key) => {
    if (key.name === 'escape') {
      onClose()
    } else if (key.name === 'up') {
      setSelectedIndex((prev) => Math.max(0, prev - 1))
    } else if (key.name === 'down') {
      setSelectedIndex((prev) => Math.min(filteredCommands.length - 1, prev + 1))
    } else if (key.name === 'return') {
      const cmd = filteredCommands[selectedIndex]
      if (cmd) {
        cmd.execute()
        onClose()
      }
    }
  })

  return (
    <box
      style={{ position: 'absolute', zIndex: 1000 }}
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <box
        borderStyle="double"
        borderColor={theme.colors.primary}
        padding={theme.spacing.xs}
        width={80}
        height={20}
        flexDirection="column"
        backgroundColor={theme.colors.background.modal}
      >
        <text fg={theme.colors.primary}>Command Palette</text>
        <text> </text>
        
        <box marginBottom={1}>
          <input
            value={search}
            onInput={setSearch}
            placeholder="Type to search commands..."
            focused={true}
            width={76}
          />
        </box>
        
        <box
          flexDirection="column"
          flexGrow={1}
          style={{ overflow: 'hidden' }}
        >
          {search.trim().length === 0 ? null : filteredCommands.length === 0 ? (
            <text fg={theme.colors.text.muted}>No commands found</text>
          ) : (
            filteredCommands.slice(0, 10).map((cmd, index) => (
              <box key={cmd.id} flexDirection="row" marginBottom={0}>
                <text fg={index === selectedIndex ? theme.colors.git.modified : theme.colors.text.muted} width={2}>
                  {index === selectedIndex ? '>' : ' '}
                </text>
                <text fg={index === selectedIndex ? theme.colors.text.primary : theme.colors.text.muted} width={30}>
                  {cmd.label}
                </text>
                <text fg={theme.colors.text.disabled} width={30}>
                  {cmd.description}
                </text>
                {cmd.shortcut && (
                  <text fg={theme.colors.primary} width={14}>
                    {cmd.shortcut}
                  </text>
                )}
              </box>
            ))
          )}
        </box>
        
        <text> </text>
        <box borderStyle={theme.borders.style} borderColor={theme.colors.border} padding={theme.spacing.none}>
          <text fg={theme.colors.text.muted}>
            Up/Down: Navigate | Enter: Execute | ESC: Close
          </text>
        </box>
      </box>
    </box>
  )
}
