import { useState, useEffect } from 'react'
import { useKeyboard } from '@opentui/react'
import { exec } from 'child_process'
import { promisify } from 'util'
import { homedir } from 'os'
import { readFile, writeFile } from 'fs/promises'
import { theme, themes, getThemeIds, setTheme, type Theme } from '../theme'
import { Modal } from './Modal'
import { Input } from './Input'
import type { } from '../theme'

const execAsync = promisify(exec)
const CONFIG_PATH = `${homedir()}/.gitarborrc`

interface SettingsModalProps {
  onClose: () => void
}

interface GitConfig {
  name: string
  email: string
}

type SettingsTab = 'git' | 'theme'
type GitField = 'name' | 'email'

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [gitConfig, setGitConfig] = useState<GitConfig>({ name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentTab, setCurrentTab] = useState<SettingsTab>('git')
  const [selectedField, setSelectedField] = useState<GitField>('name')
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [currentThemeId, setCurrentThemeId] = useState('default-dark')

  useEffect(() => {
    async function loadConfig() {
      try {
        // Load git config
        const [nameResult, emailResult] = await Promise.all([
          execAsync('git config --global user.name').catch(() => ({ stdout: '' })),
          execAsync('git config --global user.email').catch(() => ({ stdout: '' })),
        ])
        setGitConfig({
          name: nameResult.stdout.trim(),
          email: emailResult.stdout.trim(),
        })

        // Load theme preference
        try {
          const config = await readFile(CONFIG_PATH, 'utf-8')
          const configData = JSON.parse(config) as { theme?: string }
          if (configData.theme) {
            const themeIds = getThemeIds()
            const themeIndex = themeIds.indexOf(configData.theme)
            if (themeIndex !== -1) {
              setCurrentThemeId(configData.theme)
              setSelectedThemeIndex(themeIndex)
            }
          }
        } catch {
          // Config file doesn't exist or is invalid - use defaults
        }
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

  const handleApplyTheme = async () => {
    try {
      setSaving(true)
      setError('')
      
      const themeIds = getThemeIds()
      const themeId = themeIds[selectedThemeIndex]
      if (!themeId) return

      // Save to config file
      let configData: { theme?: string } = {}
      try {
        const existingConfig = await readFile(CONFIG_PATH, 'utf-8')
        configData = JSON.parse(existingConfig) as { theme?: string }
      } catch {
        // Config doesn't exist yet
      }

      configData.theme = themeId
      await writeFile(CONFIG_PATH, JSON.stringify(configData, null, 2))

      // Apply theme immediately
      setTheme(themeId)
      setCurrentThemeId(themeId)
    } catch (err) {
      setError('Failed to save theme preference')
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
    } else if (key.name === 'tab') {
      // Switch tabs
      setCurrentTab((prev) => (prev === 'git' ? 'theme' : 'git'))
    } else if (currentTab === 'git') {
      // Git config tab navigation
      if (key.name === 'up' || key.name === 'down') {
        setSelectedField((prev) => (prev === 'name' ? 'email' : 'name'))
      } else if (key.name === 'return' || key.sequence === 'e') {
        setEditMode(true)
        setEditValue(gitConfig[selectedField])
      }
    } else if (currentTab === 'theme') {
      // Theme tab navigation
      const themeIds = getThemeIds()
      if (key.name === 'up') {
        setSelectedThemeIndex((prev) => Math.max(0, prev - 1))
      } else if (key.name === 'down') {
        setSelectedThemeIndex((prev) => Math.min(themeIds.length - 1, prev + 1))
      } else if (key.name === 'return' || key.sequence === 'a') {
        void handleApplyTheme()
      }
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

  const themeIds = getThemeIds()
  const selectedTheme = themes[themeIds[selectedThemeIndex]!]

  return (
    <Modal
      width={90}
      height={22}
      title="Settings"
    >
      {/* Tabs */}
      <box flexDirection="row" marginBottom={1}>
        <text fg={currentTab === 'git' ? theme.colors.primary : theme.colors.text.muted}>
          [Git Config]
        </text>
        <text> </text>
        <text fg={currentTab === 'theme' ? theme.colors.primary : theme.colors.text.muted}>
          [Themes]
        </text>
      </box>
      
      {/* Git Config Tab */}
      {currentTab === 'git' && (
        <>
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
                width={70}
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
                width={70}
              />
            ) : (
              <text fg={theme.colors.text.primary}>{gitConfig.email || '(not set)'}</text>
            )}
          </box>
        </>
      )}

      {/* Theme Tab */}
      {currentTab === 'theme' && selectedTheme && (
        <>
          <text fg={theme.colors.text.muted}>Choose a color theme</text>
          <text> </text>
          
          {/* Theme list and preview side-by-side */}
          <box flexDirection="row" flexGrow={1}>
            {/* Theme list */}
            <box flexDirection="column" width={35} marginRight={2}>
              {themeIds.map((themeId, index) => {
                const t = themes[themeId]
                const isSelected = index === selectedThemeIndex
                const isCurrent = themeId === currentThemeId
                return (
                  <box key={themeId} flexDirection="row" marginBottom={1}>
                    <text fg={isSelected ? theme.colors.git.modified : theme.colors.text.muted}>
                      {isSelected ? '> ' : '  '}
                    </text>
                    <text fg={isSelected ? theme.colors.text.primary : theme.colors.text.secondary}>
                      {t?.name}
                      {isCurrent ? ' (active)' : ''}
                    </text>
                  </box>
                )
              })}
            </box>

            {/* Theme preview */}
            <box
              flexDirection="column"
              flexGrow={1}
              borderStyle={theme.borders.style}
              borderColor={theme.colors.border}
              padding={theme.spacing.xs}
            >
              <text fg={theme.colors.text.muted}>Preview: {selectedTheme.name}</text>
              <box flexDirection="row">
                <text fg={theme.colors.text.muted}>{selectedTheme.description}</text>
              </box>
              <text> </text>
              
              {/* Color samples */}
              <box flexDirection="row" marginBottom={1}>
                <text fg={selectedTheme.colors.git.staged}>Staged  </text>
                <text fg={selectedTheme.colors.git.modified}>Modified  </text>
                <text fg={selectedTheme.colors.git.untracked}>Untracked</text>
              </box>
              
              <box flexDirection="row" marginBottom={1}>
                <text fg={selectedTheme.colors.git.added}>Added  </text>
                <text fg={selectedTheme.colors.git.deleted}>Deleted</text>
              </box>
              
              <box flexDirection="row" marginBottom={1}>
                <text fg={selectedTheme.colors.status.success}>Success  </text>
                <text fg={selectedTheme.colors.status.error}>Error  </text>
                <text fg={selectedTheme.colors.status.warning}>Warning</text>
              </box>
              
              <box flexDirection="row">
                <text fg={selectedTheme.colors.primary}>Primary  </text>
                <text fg={selectedTheme.colors.text.muted}>Muted  </text>
                <text fg={selectedTheme.colors.status.info}>Info</text>
              </box>
            </box>
          </box>
        </>
      )}
      
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
          ) : currentTab === 'git' ? (
            editMode
              ? 'Enter: Save | ESC: Cancel'
              : 'Tab: Switch Tab | Up/Down: Navigate | Enter/E: Edit | ESC: Close'
          ) : (
            'Tab: Switch Tab | Up/Down: Select Theme | Enter/A: Apply Theme | ESC: Close'
          )}
        </text>
      </box>
    </Modal>
  )
}
