import { useState } from 'react'
import { useKeyboard } from '@opentui/react'
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
        borderColor="#CC8844"
        padding={1}
        width={80}
        height={20}
        flexDirection="column"
        backgroundColor="#1a1a1a"
      >
        <text fg="#CC8844">Command Palette</text>
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
            <text fg="#999999">No commands found</text>
          ) : (
            filteredCommands.slice(0, 10).map((cmd, index) => (
              <box key={cmd.id} flexDirection="row" marginBottom={0}>
                <text fg={index === selectedIndex ? '#FFFF00' : '#999999'} width={2}>
                  {index === selectedIndex ? '>' : ' '}
                </text>
                <text fg={index === selectedIndex ? '#FFFFFF' : '#999999'} width={30}>
                  {cmd.label}
                </text>
                <text fg="#666666" width={30}>
                  {cmd.description}
                </text>
                {cmd.shortcut && (
                  <text fg="#CC8844" width={14}>
                    {cmd.shortcut}
                  </text>
                )}
              </box>
            ))
          )}
        </box>
        
        <text> </text>
        <box borderStyle="single" borderColor="#555555" padding={0}>
          <text fg="#999999">
            Up/Down: Navigate | Enter: Execute | ESC: Close
          </text>
        </box>
      </box>
    </box>
  )
}
