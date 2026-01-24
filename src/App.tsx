import { useState, useEffect, useCallback } from 'react'
import { useKeyboard, useRenderer } from '@opentui/react'
import { GitClient } from './utils/git'
import { FileSystemWatcher } from './utils/watcher'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { MainView } from './components/MainView'
import { LogView } from './components/LogView'
import { DiffView } from './components/DiffView'
import { CommitModal } from './components/CommitModal'
import { ExitModal } from './components/ExitModal'
import { CommandPalette } from './components/CommandPalette'
import { SettingsModal } from './components/SettingsModal'
import type { GitStatus, GitCommit, GitBranch, View } from './types/git'
import type { Command } from './types/commands'

export function App({ cwd }: { cwd: string }) {
  const renderer = useRenderer()
  const [git] = useState(() => new GitClient(cwd))
  const [watcher] = useState(() => new FileSystemWatcher(cwd, () => {}))
  const [view, setView] = useState<View>('main')
  const [focusedPanel, setFocusedPanel] = useState<'status' | 'branches' | 'log'>('status')
  const [status, setStatus] = useState<GitStatus>({
    branch: '',
    ahead: 0,
    behind: 0,
    staged: [],
    unstaged: [],
    untracked: [],
  })
  const [commits, setCommits] = useState<GitCommit[]>([])
  const [branches, setBranches] = useState<GitBranch[]>([])
  const [diff, setDiff] = useState<string>('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [message, setMessage] = useState('')
  const [showCommitModal, setShowCommitModal] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Clean exit handler
  const handleExit = useCallback(() => {
    const cleanExit = (globalThis as any).__gitarborCleanExit
    if (cleanExit) {
      cleanExit()
    } else {
      // Fallback if global not available
      renderer.destroy()
      process.exit(0)
    }
  }, [renderer])

  const loadData = useCallback(async (silent: boolean = false) => {
    try {
      if (!silent) {
        setLoading(true)
      }
      const [statusData, commitsData, branchesData] = await Promise.all([
        git.getStatus(),
        git.getLog(50),
        git.getBranches(),
      ])
      setStatus(statusData)
      setCommits(commitsData)
      setBranches(branchesData)
      if (!silent) {
        setMessage('Data loaded')
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }, [git])

  const loadDiff = useCallback(async () => {
    try {
      const allFiles = [...status.staged, ...status.unstaged]
      if (allFiles.length > 0 && selectedIndex < allFiles.length) {
        const file = allFiles[selectedIndex]
        if (file) {
          const diffContent = file.staged
            ? await git.getStagedDiff(file.path)
            : await git.getDiff(file.path)
          setDiff(diffContent)
        }
      } else {
        setDiff('')
      }
    } catch (error) {
      setMessage(`Error loading diff: ${error}`)
    }
  }, [git, status, selectedIndex])

  useEffect(() => {
    void loadData(true)
  }, [loadData])

  // Update watcher callback when loadData changes
  useEffect(() => {
    watcher.setCallback(() => void loadData(true))
  }, [watcher, loadData])

  // Start file system watcher
  useEffect(() => {
    watcher.start()
    return () => watcher.stop()
  }, [watcher])

  useEffect(() => {
    if (view === 'diff') {
      void loadDiff()
    }
  }, [view, loadDiff])

  const handleStage = useCallback(async (path: string) => {
    try {
      await git.stageFile(path)
      await loadData(true)
      setMessage(`Staged: ${path}`)
    } catch (error) {
      setMessage(`Error staging: ${error}`)
    }
  }, [git, loadData])

  const handleUnstage = useCallback(async (path: string) => {
    try {
      await git.unstageFile(path)
      await loadData(true)
      setMessage(`Unstaged: ${path}`)
    } catch (error) {
      setMessage(`Error unstaging: ${error}`)
    }
  }, [git, loadData])

  const handleCommit = useCallback(async (commitMessage: string) => {
    try {
      await git.commit(commitMessage)
      await loadData(true)
      setMessage(`Committed: ${commitMessage}`)
      setShowCommitModal(false)
    } catch (error) {
      setMessage(`Error committing: ${error}`)
      setShowCommitModal(false)
    }
  }, [git, loadData])

  const handleCheckout = useCallback(async (branch: string) => {
    try {
      await git.checkout(branch)
      await loadData(true)
      setMessage(`Switched to branch: ${branch}`)
    } catch (error) {
      setMessage(`Error checking out: ${error}`)
    }
  }, [git, loadData])

  const getMaxIndex = useCallback(() => {
    switch (view) {
      case 'main':
        if (focusedPanel === 'status') {
          return status.staged.length + status.unstaged.length + status.untracked.length - 1
        } else if (focusedPanel === 'branches') {
          return branches.filter((b) => !b.remote).length - 1
        } else {
          return Math.min(commits.length - 1, 9) // log panel shows max 10 commits
        }
      case 'log':
        return commits.length - 1
      default:
        return 0
    }
  }, [view, focusedPanel, status, commits, branches])

  // Define available commands
  const commands: Command[] = [
    {
      id: 'open-settings',
      label: 'Open Settings',
      description: 'Configure git global user name and email',
      shortcut: ',',
      execute: () => setShowSettingsModal(true),
    },
    {
      id: 'view-main',
      label: 'View: Main',
      description: 'Show status and branches side by side',
      shortcut: '1',
      execute: () => {
        setView('main')
        setSelectedIndex(0)
      },
    },
    {
      id: 'view-log',
      label: 'View: Log',
      description: 'Show commit history (full screen)',
      shortcut: '2',
      execute: () => {
        setView('log')
        setSelectedIndex(0)
      },
    },
    {
      id: 'view-diff',
      label: 'View: Diff',
      description: 'Show file differences',
      shortcut: '3',
      execute: () => setView('diff'),
    },
    {
      id: 'panel-status',
      label: 'Panel: Status',
      description: 'Focus status panel',
      shortcut: '[',
      execute: () => {
        setView('main')
        setFocusedPanel('status')
        setSelectedIndex(0)
      },
    },
    {
      id: 'panel-branches',
      label: 'Panel: Branches',
      description: 'Focus branches panel',
      shortcut: ']',
      execute: () => {
        setView('main')
        setFocusedPanel('branches')
        setSelectedIndex(0)
      },
    },
    {
      id: 'panel-log',
      label: 'Panel: Log',
      description: 'Focus log panel',
      shortcut: '\\',
      execute: () => {
        setView('main')
        setFocusedPanel('log')
        setSelectedIndex(0)
      },
    },
    {
      id: 'commit',
      label: 'Commit Changes',
      description: 'Create a new commit with staged files',
      shortcut: 'c',
      execute: () => {
        if (status.staged.length > 0) {
          setShowCommitModal(true)
        } else {
          setMessage('No staged files to commit')
        }
      },
    },
    {
      id: 'refresh',
      label: 'Refresh Data',
      description: 'Reload git status and data',
      execute: () => void loadData(),
    },
    {
      id: 'exit',
      label: 'Exit',
      description: 'Exit the application',
      shortcut: 'q / ESC',
      execute: () => setShowExitModal(true),
    },
  ]

  useKeyboard((key) => {
    if (showExitModal || showCommandPalette || showSettingsModal) {
      // Modals handle their own keyboard input
      return
    }

    if (showCommitModal) {
      if (key.name === 'escape') {
        setShowCommitModal(false)
      }
      return
    }

    // Command palette with '/' key
    if (key.sequence === '/') {
      setShowCommandPalette(true)
      return
    }

    // Settings with ',' key
    if (key.sequence === ',') {
      setShowSettingsModal(true)
      return
    }

    // ESC or 'q' key should show exit modal
    if (key.name === 'escape' || key.sequence === 'q') {
      setShowExitModal(true)
      return
    }

    // View switching
    if (key.sequence === '1') {
      setView('main')
      setSelectedIndex(0)
    } else if (key.sequence === '2') {
      setView('log')
      setSelectedIndex(0)
    } else if (key.sequence === '3') {
      setView('diff')
    }

    // Panel switching (when in main view)
    if (view === 'main') {
      if (key.sequence === '[') {
        setFocusedPanel('status')
        setSelectedIndex(0)
      } else if (key.sequence === ']') {
        setFocusedPanel('branches')
        setSelectedIndex(0)
      } else if (key.sequence === '\\') {
        setFocusedPanel('log')
        setSelectedIndex(0)
      }
    }

    // Navigation
    if (key.name === 'up') {
      setSelectedIndex((prev) => Math.max(0, prev - 1))
    } else if (key.name === 'down') {
      const max = getMaxIndex()
      setSelectedIndex((prev) => Math.min(max, prev + 1))
    }

    // Actions
    if (key.name === 'return') {
      if (view === 'main' && focusedPanel === 'branches') {
        const localBranches = branches.filter((b) => !b.remote)
        const branch = localBranches[selectedIndex]
        if (branch && !branch.current) {
          void handleCheckout(branch.name)
        }
      }
    }

    if (key.sequence === 's') {
      if (view === 'main' && focusedPanel === 'status') {
        const allFiles = [...status.staged, ...status.unstaged, ...status.untracked]
        const file = allFiles[selectedIndex]
        if (file && !file.staged) {
          void handleStage(file.path)
        }
      }
    }

    if (key.sequence === 'u') {
      if (view === 'main' && focusedPanel === 'status') {
        const allFiles = [...status.staged, ...status.unstaged, ...status.untracked]
        const file = allFiles[selectedIndex]
        if (file && file.staged) {
          void handleUnstage(file.path)
        }
      }
    }

    if (key.sequence === 'c') {
      if (status.staged.length > 0) {
        setShowCommitModal(true)
      } else {
        setMessage('No staged files to commit')
      }
    }
  })

  const getViewName = (): string => {
    switch (view) {
      case 'main': {
        if (focusedPanel === 'status') return 'Main (Status)'
        if (focusedPanel === 'branches') return 'Main (Branches)'
        return 'Main (Log)'
      }
      case 'log': return 'Log'
      case 'diff': return 'Diff'
    }
  }

  return (
    <box width="100%" height="100%" flexDirection="column">
      <Header
        branch={status.branch}
        ahead={status.ahead}
        behind={status.behind}
        view={getViewName()}
      />
      
      {view === 'main' && (
        <MainView
          staged={status.staged}
          unstaged={status.unstaged}
          untracked={status.untracked}
          branches={branches}
          commits={commits}
          selectedIndex={selectedIndex}
          focusedPanel={focusedPanel}
          onStage={handleStage}
          onUnstage={handleUnstage}
        />
      )}

      {view === 'log' && (
        <LogView
          commits={commits}
          selectedIndex={selectedIndex}
          focused={!showCommitModal}
        />
      )}

      {view === 'diff' && (
        <DiffView
          diff={diff}
          focused={!showCommitModal}
        />
      )}

      <Footer message={loading ? 'Loading...' : message} />

      {showCommitModal && (
        <CommitModal
          onCommit={handleCommit}
          onCancel={() => setShowCommitModal(false)}
        />
      )}

      {showExitModal && (
        <ExitModal
          onConfirm={handleExit}
          onCancel={() => setShowExitModal(false)}
        />
      )}

      {showCommandPalette && (
        <CommandPalette
          commands={commands}
          onClose={() => setShowCommandPalette(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </box>
  )
}
