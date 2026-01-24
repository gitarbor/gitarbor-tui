import { useState, useEffect, useCallback } from 'react'
import { useKeyboard } from '@opentui/react'
import { GitClient } from './utils/git'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { StatusView } from './components/StatusView'
import { LogView } from './components/LogView'
import { BranchesView } from './components/BranchesView'
import { DiffView } from './components/DiffView'
import { CommitModal } from './components/CommitModal'
import { ExitModal } from './components/ExitModal'
import type { GitStatus, GitCommit, GitBranch, View } from './types/git'

export function App({ cwd }: { cwd: string }) {
  const [git] = useState(() => new GitClient(cwd))
  const [view, setView] = useState<View>('status')
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
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [statusData, commitsData, branchesData] = await Promise.all([
        git.getStatus(),
        git.getLog(50),
        git.getBranches(),
      ])
      setStatus(statusData)
      setCommits(commitsData)
      setBranches(branchesData)
      setMessage('Data loaded')
    } catch (error) {
      setMessage(`Error: ${error}`)
    } finally {
      setLoading(false)
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
    void loadData()
  }, [loadData])

  useEffect(() => {
    if (view === 'diff') {
      void loadDiff()
    }
  }, [view, loadDiff])

  const handleStage = useCallback(async (path: string) => {
    try {
      await git.stageFile(path)
      await loadData()
      setMessage(`Staged: ${path}`)
    } catch (error) {
      setMessage(`Error staging: ${error}`)
    }
  }, [git, loadData])

  const handleUnstage = useCallback(async (path: string) => {
    try {
      await git.unstageFile(path)
      await loadData()
      setMessage(`Unstaged: ${path}`)
    } catch (error) {
      setMessage(`Error unstaging: ${error}`)
    }
  }, [git, loadData])

  const handleCommit = useCallback(async (commitMessage: string) => {
    try {
      await git.commit(commitMessage)
      await loadData()
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
      await loadData()
      setMessage(`Switched to branch: ${branch}`)
    } catch (error) {
      setMessage(`Error checking out: ${error}`)
    }
  }, [git, loadData])

  const getMaxIndex = useCallback(() => {
    switch (view) {
      case 'status':
        return status.staged.length + status.unstaged.length + status.untracked.length - 1
      case 'log':
        return commits.length - 1
      case 'branches':
        return branches.filter((b) => !b.remote).length - 1
      default:
        return 0
    }
  }, [view, status, commits, branches])

  useKeyboard((key) => {
    if (showExitModal) {
      // Exit modal handles its own keyboard input
      return
    }

    if (showCommitModal) {
      if (key.name === 'escape') {
        setShowCommitModal(false)
      }
      return
    }

    // ESC or 'q' key should show exit modal
    if (key.name === 'escape' || key.sequence === 'q') {
      setShowExitModal(true)
      return
    }

    // View switching
    if (key.sequence === '1') {
      setView('status')
      setSelectedIndex(0)
    } else if (key.sequence === '2') {
      setView('log')
      setSelectedIndex(0)
    } else if (key.sequence === '3') {
      setView('branches')
      setSelectedIndex(0)
    } else if (key.sequence === '4') {
      setView('diff')
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
      if (view === 'branches') {
        const localBranches = branches.filter((b) => !b.remote)
        const branch = localBranches[selectedIndex]
        if (branch && !branch.current) {
          void handleCheckout(branch.name)
        }
      }
    }

    if (key.sequence === 's') {
      if (view === 'status') {
        const allFiles = [...status.staged, ...status.unstaged, ...status.untracked]
        const file = allFiles[selectedIndex]
        if (file && !file.staged) {
          void handleStage(file.path)
        }
      }
    }

    if (key.sequence === 'u') {
      if (view === 'status') {
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
      case 'status': return 'Status'
      case 'log': return 'Log'
      case 'branches': return 'Branches'
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
      
      {view === 'status' && (
        <StatusView
          staged={status.staged}
          unstaged={status.unstaged}
          untracked={status.untracked}
          selectedIndex={selectedIndex}
          focused={!showCommitModal}
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

      {view === 'branches' && (
        <BranchesView
          branches={branches}
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
          onConfirm={() => process.exit(0)}
          onCancel={() => setShowExitModal(false)}
        />
      )}
    </box>
  )
}
