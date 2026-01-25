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
import { ProgressModal } from './components/ProgressModal'
import { StashView } from './components/StashView'
import { StashModal } from './components/StashModal'
import type { GitStatus, GitCommit, GitBranch, GitStash, View } from './types/git'
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
  const [stashes, setStashes] = useState<GitStash[]>([])
  const [diff, setDiff] = useState<string>('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [message, setMessage] = useState('')
  const [showCommitModal, setShowCommitModal] = useState(false)
  const [showStashModal, setShowStashModal] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [progressTitle, setProgressTitle] = useState('')
  const [progressMessages, setProgressMessages] = useState<string[]>([])
  const [progressComplete, setProgressComplete] = useState(false)
  const [progressError, setProgressError] = useState<string | undefined>(undefined)

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
      const [statusData, commitsData, branchesData, stashesData] = await Promise.all([
        git.getStatus(),
        git.getLog(50),
        git.getBranches(),
        git.getStashes(),
      ])
      setStatus(statusData)
      setCommits(commitsData)
      setBranches(branchesData)
      setStashes(stashesData)
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

  const handleStageAll = useCallback(async () => {
    try {
      const totalFiles = status.unstaged.length + status.untracked.length
      if (totalFiles === 0) {
        setMessage('No files to stage')
        return
      }
      await git.stageAll()
      await loadData(true)
      setMessage(`Staged all files (${totalFiles})`)
    } catch (error) {
      setMessage(`Error staging all: ${error}`)
    }
  }, [git, loadData, status])

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

  const handlePush = useCallback(async () => {
    try {
      setMessage('Pushing changes...')

      await git.push()

      await loadData(true)
      setMessage('Push completed successfully')
    } catch (error) {
      setMessage(`Push failed: ${error}`)
    }
  }, [git, loadData])

  const handlePull = useCallback(async () => {
    try {
      setProgressTitle('Pulling changes...')
      setProgressMessages([])
      setProgressComplete(false)
      setProgressError(undefined)
      setShowProgressModal(true)

      await git.pull((line) => {
        setProgressMessages((prev) => [...prev, line])
      })

      setProgressComplete(true)
      await loadData(true)
      setMessage('Pull completed successfully')
    } catch (error) {
      setProgressComplete(true)
      setProgressError(String(error))
      setMessage(`Pull failed: ${error}`)
    }
  }, [git, loadData])

  const handleFetch = useCallback(async () => {
    try {
      setMessage('Fetching from remotes...')

      await git.fetch()

      await loadData(true)
      setMessage('Fetch completed successfully')
    } catch (error) {
      setMessage(`Fetch failed: ${error}`)
    }
  }, [git, loadData])

  const handleCreateStash = useCallback(async (stashMessage: string) => {
    try {
      await git.createStash(stashMessage || undefined)
      await loadData(true)
      setMessage(stashMessage ? `Stashed: ${stashMessage}` : 'Changes stashed')
      setShowStashModal(false)
    } catch (error) {
      setMessage(`Error creating stash: ${error}`)
      setShowStashModal(false)
    }
  }, [git, loadData])

  const handleApplyStash = useCallback(async (index: number) => {
    try {
      await git.applyStash(index)
      await loadData(true)
      setMessage(`Applied stash@{${index}}`)
    } catch (error) {
      setMessage(`Error applying stash: ${error}`)
    }
  }, [git, loadData])

  const handlePopStash = useCallback(async (index: number) => {
    try {
      await git.popStash(index)
      await loadData(true)
      setMessage(`Popped stash@{${index}}`)
    } catch (error) {
      setMessage(`Error popping stash: ${error}`)
    }
  }, [git, loadData])

  const handleDropStash = useCallback(async (index: number) => {
    try {
      await git.dropStash(index)
      await loadData(true)
      setMessage(`Dropped stash@{${index}}`)
    } catch (error) {
      setMessage(`Error dropping stash: ${error}`)
    }
  }, [git, loadData])

  const handleViewStashDiff = useCallback(async (index: number) => {
    try {
      const stashDiff = await git.getStashDiff(index)
      setDiff(stashDiff)
      setView('diff')
      setMessage(`Viewing diff for stash@{${index}}`)
    } catch (error) {
      setMessage(`Error loading stash diff: ${error}`)
    }
  }, [git])

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
      case 'stash':
        return stashes.length - 1
      default:
        return 0
    }
  }, [view, focusedPanel, status, commits, branches, stashes])

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
      id: 'stage-all',
      label: 'Stage All Changes',
      description: 'Stage all modified and untracked files',
      shortcut: 'a',
      execute: () => void handleStageAll(),
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
      id: 'view-stash',
      label: 'View: Stash',
      description: 'Show stash list',
      shortcut: '4',
      execute: () => {
        setView('stash')
        setSelectedIndex(0)
      },
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
      id: 'push',
      label: 'Push Changes',
      description: 'Push commits to remote repository',
      shortcut: 'P',
      execute: () => void handlePush(),
    },
    {
      id: 'pull',
      label: 'Pull Changes',
      description: 'Pull and merge changes from remote',
      shortcut: 'p',
      execute: () => void handlePull(),
    },
    {
      id: 'fetch',
      label: 'Fetch from Remotes',
      description: 'Fetch updates from all remotes',
      shortcut: 'f',
      execute: () => void handleFetch(),
    },
    {
      id: 'create-stash',
      label: 'Create Stash',
      description: 'Stash working directory changes',
      shortcut: 's',
      execute: () => setShowStashModal(true),
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
    if (showExitModal || showCommandPalette || showSettingsModal || showProgressModal) {
      // Modals handle their own keyboard input
      return
    }

    if (showCommitModal || showStashModal) {
      if (key.name === 'escape') {
        setShowCommitModal(false)
        setShowStashModal(false)
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
    } else if (key.sequence === '4') {
      setView('stash')
      setSelectedIndex(0)
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

    // Spacebar to stage/unstage file in status panel
    if (key.name === 'space') {
      if (view === 'main' && focusedPanel === 'status') {
        const allFiles = [...status.staged, ...status.unstaged, ...status.untracked]
        const file = allFiles[selectedIndex]
        if (file) {
          if (file.staged) {
            void handleUnstage(file.path)
          } else {
            void handleStage(file.path)
          }
        }
      }
    }

    // 's' key to create stash
    if (key.sequence === 's') {
      setShowStashModal(true)
    }

    if (key.sequence === 'a') {
      void handleStageAll()
    }

    if (key.sequence === 'c') {
      if (status.staged.length > 0) {
        setShowCommitModal(true)
      } else {
        setMessage('No staged files to commit')
      }
    }

    if (key.sequence === 'P') {
      void handlePush()
    }

    if (key.sequence === 'p') {
      void handlePull()
    }

    if (key.sequence === 'f') {
      void handleFetch()
    }

    // Stash operations
    if (key.sequence === 'S') {
      setShowStashModal(true)
    }

    // Stash view actions
    if (view === 'stash' && stashes.length > 0) {
      const stash = stashes[selectedIndex]
      
      if (stash && key.name === 'return') {
        // Apply stash on Enter
        void handleApplyStash(stash.index)
      } else if (stash && key.sequence === 'P') {
        // Pop stash on Shift+P
        void handlePopStash(stash.index)
      } else if (stash && key.sequence === 'D') {
        // Drop stash on Shift+D
        void handleDropStash(stash.index)
      } else if (stash && key.sequence === 'V') {
        // View stash diff on Shift+V
        void handleViewStashDiff(stash.index)
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
      case 'stash': return 'Stash'
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
          focused={!showCommitModal && !showStashModal}
        />
      )}

      {view === 'stash' && (
        <StashView
          stashes={stashes}
          selectedIndex={selectedIndex}
          focused={!showCommitModal && !showStashModal}
        />
      )}

      <Footer message={loading ? 'Loading...' : message} />

      {showCommitModal && (
        <CommitModal
          onCommit={handleCommit}
          onCancel={() => setShowCommitModal(false)}
        />
      )}

      {showStashModal && (
        <StashModal
          onStash={handleCreateStash}
          onCancel={() => setShowStashModal(false)}
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

      {showProgressModal && (
        <ProgressModal
          title={progressTitle}
          messages={progressMessages}
          isComplete={progressComplete}
          error={progressError}
          onClose={() => setShowProgressModal(false)}
        />
      )}
    </box>
  )
}
