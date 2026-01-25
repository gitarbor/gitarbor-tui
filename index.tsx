#!/usr/bin/env bun
// @ts-nocheck
import { createCliRenderer } from '@opentui/core'
import { createRoot } from '@opentui/react'
import { homedir } from 'os'
import { readFile } from 'fs/promises'
import { MultiRepoApp } from './src/MultiRepoApp'
import { setTheme } from './src/theme'

// Load theme preference from config
const CONFIG_PATH = `${homedir()}/.gitarborrc`

async function loadThemePreference() {
  try {
    const config = await readFile(CONFIG_PATH, 'utf-8')
    const configData = JSON.parse(config)
    if (configData.theme) {
      setTheme(configData.theme)
    }
  } catch {
    // Config doesn't exist or is invalid - use default theme
  }
}

// Load theme before starting the app
await loadThemePreference()

// Create the CLI renderer (async)
const renderer = await createCliRenderer({
  exitOnCtrlC: false, // We handle Ctrl+C in the app
  useAlternateScreen: true, // Enable fullscreen mode with alternate buffer
})

// Create and mount the React root
const cwd = process.cwd()
const root = createRoot(renderer)
root.render(<MultiRepoApp initialCwd={cwd} />)

// Clean exit handler
const cleanExit = () => {
  root.unmount()
  renderer.destroy()
  process.exit(0)
}

// Handle cleanup on exit signals
process.on('SIGINT', cleanExit)
process.on('SIGTERM', cleanExit)

// Export cleanExit for use in App component
;(globalThis as any).__gitarborCleanExit = cleanExit
