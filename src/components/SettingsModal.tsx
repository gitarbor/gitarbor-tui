import { useState, useEffect } from 'react'
import { useKeyboard } from '@opentui/react'
import { exec } from 'child_process'
import { promisify } from 'util'
import { theme } from '../theme'
import { Modal } from './Modal'
import { Input } from './Input'

const execAsync = promisify(exec)

interface SettingsModalProps {
  onClose: () => void
}

interface GitConfig {
  name: string
  email: string
}

type GitField = 'name' | 'email'

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [gitConfig, setGitConfig] = useState<GitConfig>({ name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedField, setSelectedField] = useState<GitField>('name')
  const [editMode, setEditMode] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadConfig() {
      try {
        const [nameResult, emailResult] = await Promise.all([
          execAsync('git config --global user.name').catch(() => ({ stdout: '' })),
          execAsync('git config --global user.email').catch(() => ({ stdout: '' })),
        ])
        setGitConfig({
          name: nameResult.stdout.trim(),
          email: emailResult.stdout.trim(),
        })
      } catch (err) {
        setError('Failed to load configuration')
      } finally {
        setLoading(false)
      }
    }
    void loadConfig()
  }, [])

  const handleSaveGitField = async () => {
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
      <Modal
        width={60}
        height={5}
        borderColor={theme.colors.primary}
      >
        <text fg={theme.colors.text.muted}>Loading configuration...</text>
      </Modal>
    )
  }

  return (
    <Modal
      width={60}
      height={14}
      title="Git Settings"
    >
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
          <Input
            value={editValue}
            onInput={setEditValue}
            onSubmit={handleSaveGitField}
            focused={true}
            width={45}
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
          <Input
            value={editValue}
            onInput={setEditValue}
            onSubmit={handleSaveGitField}
            focused={true}
            width={45}
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
          {saving ? (
            'Saving...'
          ) : editMode ? (
            'Enter: Save | ESC: Cancel'
          ) : (
            'Up/Down: Navigate | Enter/E: Edit | ESC: Close'
          )}
        </text>
      </box>
    </Modal>
  )
}
