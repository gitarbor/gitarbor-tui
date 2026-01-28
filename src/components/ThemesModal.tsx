import { useState, useEffect } from 'react';
import { useKeyboard } from '@opentui/react';
import { homedir } from 'os';
import { readFile, writeFile } from 'fs/promises';
import { theme, themes, getThemeIds, setTheme, onThemeChange } from '../theme';
import { Modal } from './Modal';

const CONFIG_PATH = `${homedir()}/.gitarborrc`;

interface ThemesModalProps {
  onClose: () => void;
}

export function ThemesModal({ onClose }: ThemesModalProps) {
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [currentThemeId, setCurrentThemeId] = useState('default-dark');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [, forceUpdate] = useState({});

  // Listen for theme changes and force re-render
  useEffect(() => {
    const unsubscribe = onThemeChange(() => {
      forceUpdate({}); // Trigger re-render when theme changes
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function loadThemePreference() {
      try {
        const config = await readFile(CONFIG_PATH, 'utf-8');
        const configData = JSON.parse(config) as { theme?: string };
        if (configData.theme) {
          const themeIds = getThemeIds();
          const themeIndex = themeIds.indexOf(configData.theme);
          if (themeIndex !== -1) {
            setCurrentThemeId(configData.theme);
            setSelectedThemeIndex(themeIndex);
          }
        }
      } catch {
        // Config file doesn't exist or is invalid - use defaults
      } finally {
        setLoading(false);
      }
    }
    void loadThemePreference();
  }, []);

  const handleApplyTheme = async () => {
    const themeIds = getThemeIds();
    const themeId = themeIds[selectedThemeIndex];
    if (!themeId) return;

    // Apply theme immediately (synchronous - no delay!)
    setTheme(themeId);
    setCurrentThemeId(themeId);

    // Save to config file in the background
    setSaving(true);
    setError('');

    try {
      let configData: { theme?: string } = {};
      try {
        const existingConfig = await readFile(CONFIG_PATH, 'utf-8');
        configData = JSON.parse(existingConfig) as { theme?: string };
      } catch {
        // Config doesn't exist yet
      }

      configData.theme = themeId;
      await writeFile(CONFIG_PATH, JSON.stringify(configData, null, 2));
    } catch (err) {
      setError('Failed to save theme preference');
    } finally {
      setSaving(false);
    }
  };

  useKeyboard((key) => {
    if (key.name === 'escape') {
      onClose();
    } else {
      const themeIds = getThemeIds();
      if (key.name === 'up') {
        setSelectedThemeIndex((prev) => Math.max(0, prev - 1));
      } else if (key.name === 'down') {
        setSelectedThemeIndex((prev) => Math.min(themeIds.length - 1, prev + 1));
      } else if (key.name === 'return' || key.sequence === 'a') {
        void handleApplyTheme();
      }
    }
  });

  if (loading) {
    return (
      <Modal width={60} height={5} borderColor={theme.colors.primary}>
        <text fg={theme.colors.text.muted}>Loading theme configuration...</text>
      </Modal>
    );
  }

  const themeIds = getThemeIds();
  const selectedTheme = themes[themeIds[selectedThemeIndex]!];

  return (
    <Modal width={90} height={22} title="Themes">
      <text fg={theme.colors.text.muted}>Choose a color theme</text>
      <text> </text>

      {/* Theme list and preview side-by-side */}
      <box flexDirection="row" flexGrow={1}>
        {/* Theme list */}
        <box flexDirection="column" width={35} marginRight={2}>
          {themeIds.map((themeId, index) => {
            const t = themes[themeId];
            const isSelected = index === selectedThemeIndex;
            const isCurrent = themeId === currentThemeId;
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
            );
          })}
        </box>

        {/* Theme preview */}
        {selectedTheme && (
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
              <text fg={selectedTheme.colors.git.staged}>Staged </text>
              <text fg={selectedTheme.colors.git.modified}>Modified </text>
              <text fg={selectedTheme.colors.git.untracked}>Untracked</text>
            </box>

            <box flexDirection="row" marginBottom={1}>
              <text fg={selectedTheme.colors.git.added}>Added </text>
              <text fg={selectedTheme.colors.git.deleted}>Deleted</text>
            </box>

            <box flexDirection="row" marginBottom={1}>
              <text fg={selectedTheme.colors.status.success}>Success </text>
              <text fg={selectedTheme.colors.status.error}>Error </text>
              <text fg={selectedTheme.colors.status.warning}>Warning</text>
            </box>

            <box flexDirection="row">
              <text fg={selectedTheme.colors.primary}>Primary </text>
              <text fg={selectedTheme.colors.text.muted}>Muted </text>
              <text fg={selectedTheme.colors.status.info}>Info</text>
            </box>
          </box>
        )}
      </box>

      {error && (
        <>
          <text> </text>
          <text fg={theme.colors.status.error}>{error}</text>
        </>
      )}

      <text> </text>
      <box
        borderStyle={theme.borders.style}
        borderColor={theme.colors.border}
        padding={theme.spacing.none}
      >
        <text fg={theme.colors.text.muted}>
          {saving ? 'Saving...' : 'Up/Down: Select Theme | Enter/A: Apply Theme | ESC: Close'}
        </text>
      </box>
    </Modal>
  );
}
