import { useState, useEffect } from 'react'
import { useKeyboard } from '@opentui/react'
import { exec } from 'child_process'
import { promisify } from 'util'
import { theme } from '../theme'

const execAsync = promisify(exec)

interface SettingsModalProps {
  onClose: () => void
}

interface GitConfig {
  name: string
  email: string
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [gitConfig, setGitConfig] = useState<GitConfig>({ name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedField, setSelectedField] = useState<'name' | 'email'>('name')
  const [editMode, setEditMode] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadGitConfig() {
      try {
        const [nameResult, emailResult] = await Promise.all([
          execAsync('git config --global user.name'),
          execAsync('git config --global user.email'),
        ])
        setGitConfig({
          name: nameResult.stdout.trim(),
          email: emailResult.stdout.trim(),
        })
      } catch (err) {
        setError('Failed to load git config')
      } finally {
        setLoading(false)
      }
    }
    void loadGitConfig()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      
      const field = selectedField === 'name' ? 'user.name' : 'user.email'
      await execAsync(`git config --global ${field} "${editValue}"`)
      
      setGitConfig((prev) => ({
        ...prev,
        [selectedField]: editValue,
      }))
      setEditMode(false)
      setEditValue('')
    } catch (err) {
      setError(`Failed to save ${selectedField}`)
    } finally {
      setSaving(false)
    }
  }

  useKeyboard((key) => {
    if (editMode) {
      if (key.name === 'escape') {
        setEditMode(false)
        setEditValue('')
      }
      // Input component handles text entry and Enter key
      return
    }

    if (key.name === 'escape') {
      onClose()
    } else if (key.name === 'up' || key.name === 'down') {
      setSelectedField((prev) => (prev === 'name' ? 'email' : 'name'))
    } else if (key.name === 'return' || key.sequence === 'e') {
      setEditMode(true)
      setEditValue(gitConfig[selectedField])
    }
  })

  if (loading) {
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
          width={60}
          backgroundColor={theme.colors.background.modal}
        >
          <text fg={theme.colors.text.muted}>Loading git configuration...</text>
        </box>
      </box>
    )
  }

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
        width={70}
        height={14}
        flexDirection="column"
        backgroundColor={theme.colors.background.modal}
      >
        <text fg={theme.colors.primary}>
          Settings
        </text>
        <text> </text>
        
        <text fg={theme.colors.text.muted}>Git Global Configuration</text>
        <text> </text>
        
        {/* Name field */}
        <box flexDirection="row" marginBottom={1}>
          <text fg={selectedField === 'name' && !editMode ? theme.colors.git.modified : theme.colors.text.muted}>
            {selectedField === 'name' && !editMode ? '> ' : '  '}
          </text>
          <text fg={theme.colors.text.muted} width={10}>
            Name:
          </text>
          {editMode && selectedField === 'name' ? (
            <input
              value={editValue}
              onInput={setEditValue}
              onSubmit={handleSave}
              focused={true}
              width={50}
            />
          ) : (
            <text fg={theme.colors.text.primary}>{gitConfig.name || '(not set)'}</text>
          )}
        </box>
        
        {/* Email field */}
        <box flexDirection="row">
          <text fg={selectedField === 'email' && !editMode ? theme.colors.git.modified : theme.colors.text.muted}>
            {selectedField === 'email' && !editMode ? '> ' : '  '}
          </text>
          <text fg={theme.colors.text.muted} width={10}>
            Email:
          </text>
          {editMode && selectedField === 'email' ? (
            <input
              value={editValue}
              onInput={setEditValue}
              onSubmit={handleSave}
              focused={true}
              width={50}
            />
          ) : (
            <text fg={theme.colors.text.primary}>{gitConfig.email || '(not set)'}</text>
          )}
        </box>
        
        {error && (
          <>
            <text> </text>
            <text fg={theme.colors.status.error}>{error}</text>
          </>
        )}
        
        <text> </text>
        <box borderStyle={theme.borders.style} borderColor={theme.colors.border} padding={theme.spacing.none}>
          <text fg={theme.colors.text.muted}>
            {editMode
              ? saving
                ? 'Saving...'
                : 'Enter: Save | ESC: Cancel'
              : 'Up/Down: Navigate | Enter/E: Edit | ESC: Close'}
          </text>
        </box>
      </box>
    </box>
  )
}
