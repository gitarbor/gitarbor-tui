import { useState, useEffect, useCallback } from 'react'
import { useKeyboard, useRenderer } from '@opentui/react'
import { theme } from './theme'
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
import { ConfirmModal } from './components/ConfirmModal'
import { RenameModal } from './components/RenameModal'
import { BranchModal } from './components/BranchModal'
import { BranchRenameModal } from './components/BranchRenameModal'
import { SetUpstreamModal } from './components/SetUpstreamModal'
import { MergeModal } from './components/MergeModal'
import { ConflictResolutionModal } from './components/ConflictResolutionModal'
import { ResetModal } from './components/ResetModal'
import { TagModal } from './components/TagModal'
import { RemoteModal } from './components/RemoteModal'
import { RemotesView } from './components/RemotesView'
import { CommandLogView } from './components/CommandLogView'
import type { GitStatus, GitCommit, GitBranch, GitStash, GitRemote, GitTag, GitMergeState, MergeStrategy, View, CommandLogEntry } from './types/git'
import type { Command } from './types/commands'

export function App({ cwd }: { cwd: string }) {
  const renderer = useRenderer()
  const [git] = useState(() => new GitClient(cwd))
  const [watcher] = useState(() => new FileSystemWatcher(cwd, () => {}))
  const [view, setView] = useState<View>('main')
  const [focusedPanel, setFocusedPanel] = useState<'status' | 'branches' | 'log' | 'stashes' | 'remotes' | 'tags' | 'diff'>('status')
  const [branchRemoteTab, setBranchRemoteTab] = useState<'branches' | 'remotes' | 'tags'>('branches')
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
  const [remotes, setRemotes] = useState<GitRemote[]>([])
  const [tags, setTags] = useState<GitTag[]>([])
  const [diff, setDiff] = useState<string>('')
  const [selectedFilePath, setSelectedFilePath] = useState<string | undefined>(undefined)
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
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmModalProps, setConfirmModalProps] = useState<{
    title: string
    message: string
    onConfirm: () => void
    danger?: boolean
  }>({ title: '', message: '', onConfirm: () => {} })
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [renameFilePath, setRenameFilePath] = useState('')
  const [showBranchModal, setShowBranchModal] = useState(false)
  const [showBranchRenameModal, setShowBranchRenameModal] = useState(false)
  const [branchToRename, setBranchToRename] = useState('')
  const [showSetUpstreamModal, setShowSetUpstreamModal] = useState(false)
  const [branchForUpstream, setBranchForUpstream] = useState('')
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [showConflictModal, setShowConflictModal] = useState(false)
  const [mergeState, setMergeState] = useState<GitMergeState>({
    inProgress: false,
    currentBranch: '',
    conflicts: [],
  })
  const [showResetModal, setShowResetModal] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)
  const [showRemoteModal, setShowRemoteModal] = useState(false)
  const [remoteModalMode, setRemoteModalMode] = useState<'add' | 'edit'>('add')
  const [remoteToEdit, setRemoteToEdit] = useState<GitRemote | undefined>(undefined)
  const [selectedCommitForAction, setSelectedCommitForAction] = useState<GitCommit | null>(null)
  const [commandLog, setCommandLog] = useState<CommandLogEntry[]>([])
  const [showCommandLog, setShowCommandLog] = useState(true)

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
      const [statusData, commitsData, branchesData, stashesData, mergeStateData, remotesData] = await Promise.all([
        git.getStatus(),
        git.getLog(50),
        git.getBranches(),
        git.getStashes(),
        git.getMergeState(),
        git.getRemotes(),
      ])
      setStatus(statusData)
      setCommits(commitsData)
      setBranches(branchesData)
      setStashes(stashesData)
      setMergeState(mergeStateData)
      setRemotes(remotesData)
      
      // Auto-show conflict modal if merge is in progress with conflicts
      if (mergeStateData.inProgress && mergeStateData.conflicts.length > 0 && !showConflictModal) {
        setShowConflictModal(true)
      }
      
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
  }, [git, showConflictModal])

  const loadDiff = useCallback(async () => {
    try {
      if (view === 'main' && focusedPanel === 'status') {
        // Load diff for selected file in status panel
        const allFiles = [...status.staged, ...status.unstaged]
        if (allFiles.length > 0 && selectedIndex < allFiles.length) {
          const file = allFiles[selectedIndex]
          if (file) {
            const diffContent = file.staged
              ? await git.getStagedDiff(file.path)
              : await git.getDiff(file.path)
            setDiff(diffContent)
            setSelectedFilePath(file.path)
          }
        } else {
          setDiff('')
          setSelectedFilePath(undefined)
        }
      } else if (view === 'diff') {
        // Keep existing diff when in dedicated diff view
        // (diff is already loaded from other actions)
      } else {
        setDiff('')
        setSelectedFilePath(undefined)
      }
    } catch (error) {
      setMessage(`Error loading diff: ${error}`)
    }
  }, [git, status, selectedIndex, view, focusedPanel])

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

  // Update command log periodically
  useEffect(() => {
    const updateCommandLog = () => {
      setCommandLog(git.getCommandLog())
    }
    
    // Update immediately
    updateCommandLog()
    
    // Update every 500ms to catch new commands
    const interval = setInterval(updateCommandLog, 500)
    
    return () => clearInterval(interval)
  }, [git])

  useEffect(() => {
    if (view === 'diff' || (view === 'main' && focusedPanel === 'status')) {
      void loadDiff()
    }
  }, [view, focusedPanel, selectedIndex, loadDiff])

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

  const handleDropStashWithConfirm = useCallback((index: number, stashName: string, message: string) => {
    setConfirmModalProps({
      title: 'Drop Stash?',
      message: `Are you sure you want to drop ${stashName}: ${message}? This cannot be undone.`,
      onConfirm: () => {
        setShowConfirmModal(false)
        void handleDropStash(index)
      },
      danger: true,
    })
    setShowConfirmModal(true)
  }, [handleDropStash])

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

  const handleUnstageAll = useCallback(async () => {
    try {
      if (status.staged.length === 0) {
        setMessage('No staged files to unstage')
        return
      }
      await git.unstageAll()
      await loadData(true)
      setMessage(`Unstaged all files (${status.staged.length})`)
    } catch (error) {
      setMessage(`Error unstaging all: ${error}`)
    }
  }, [git, loadData, status])

  const handleDiscardChanges = useCallback(async (path: string) => {
    try {
      await git.discardChanges(path)
      await loadData(true)
      setMessage(`Discarded changes: ${path}`)
    } catch (error) {
      setMessage(`Error discarding changes: ${error}`)
    }
  }, [git, loadData])

  const handleDeleteUntracked = useCallback(async (path: string) => {
    try {
      await git.deleteUntrackedFile(path)
      await loadData(true)
      setMessage(`Deleted untracked file: ${path}`)
    } catch (error) {
      setMessage(`Error deleting file: ${error}`)
    }
  }, [git, loadData])

  const handleRenameFile = useCallback(async (oldPath: string, newPath: string) => {
    try {
      await git.renameFile(oldPath, newPath)
      await loadData(true)
      setMessage(`Renamed: ${oldPath} → ${newPath}`)
      setShowRenameModal(false)
    } catch (error) {
      setMessage(`Error renaming file: ${error}`)
      setShowRenameModal(false)
    }
  }, [git, loadData])

  const handleDiscardWithConfirm = useCallback((path: string) => {
    setConfirmModalProps({
      title: 'Discard Changes?',
      message: `Are you sure you want to discard all changes to "${path}"?`,
      onConfirm: () => {
        setShowConfirmModal(false)
        void handleDiscardChanges(path)
      },
      danger: true,
    })
    setShowConfirmModal(true)
  }, [handleDiscardChanges])

  const handleDeleteWithConfirm = useCallback((path: string) => {
    setConfirmModalProps({
      title: 'Delete Untracked File?',
      message: `Are you sure you want to delete "${path}"?`,
      onConfirm: () => {
        setShowConfirmModal(false)
        void handleDeleteUntracked(path)
      },
      danger: true,
    })
    setShowConfirmModal(true)
  }, [handleDeleteUntracked])

  const handleUnstageAllWithConfirm = useCallback(() => {
    if (status.staged.length === 0) {
      setMessage('No staged files to unstage')
      return
    }
    setConfirmModalProps({
      title: 'Unstage All Files?',
      message: `Are you sure you want to unstage all ${status.staged.length} staged files?`,
      onConfirm: () => {
        setShowConfirmModal(false)
        void handleUnstageAll()
      },
      danger: false,
    })
    setShowConfirmModal(true)
  }, [handleUnstageAll, status])

  const handleRenameWithModal = useCallback((path: string) => {
    setRenameFilePath(path)
    setShowRenameModal(true)
  }, [])

  const handleCreateBranch = useCallback(async (name: string, startPoint?: string) => {
    try {
      await git.createBranch(name, startPoint)
      await loadData(true)
      setMessage(`Created branch: ${name}`)
      setShowBranchModal(false)
    } catch (error) {
      setMessage(`Error creating branch: ${error}`)
      setShowBranchModal(false)
    }
  }, [git, loadData])

  const handleDeleteBranch = useCallback((branch: string) => {
    setConfirmModalProps({
      title: 'Delete Branch?',
      message: `Are you sure you want to delete branch "${branch}"? This cannot be undone if the branch is not merged.`,
      onConfirm: async () => {
        setShowConfirmModal(false)
        try {
          await git.deleteBranch(branch, false)
          await loadData(true)
          setMessage(`Deleted branch: ${branch}`)
        } catch (error) {
          // Try to get merge status to provide better error message
          const errorMsg = String(error)
          if (errorMsg.includes('not fully merged')) {
            setConfirmModalProps({
              title: 'Force Delete Branch?',
              message: `Branch "${branch}" is not fully merged. Force delete anyway? This will permanently lose commits.`,
              onConfirm: async () => {
                setShowConfirmModal(false)
                try {
                  await git.deleteBranch(branch, true)
                  await loadData(true)
                  setMessage(`Force deleted branch: ${branch}`)
                } catch (err) {
                  setMessage(`Error force deleting branch: ${err}`)
                }
              },
              danger: true,
            })
            setShowConfirmModal(true)
          } else {
            setMessage(`Error deleting branch: ${error}`)
          }
        }
      },
      danger: true,
    })
    setShowConfirmModal(true)
  }, [git, loadData])

  const handleDeleteRemoteBranch = useCallback((remoteBranch: string) => {
    // Parse remote and branch name from "remotes/origin/branch-name"
    const parts = remoteBranch.replace('remotes/', '').split('/')
    const remote = parts[0]
    const branch = parts.slice(1).join('/')
    
    if (!remote || !branch) {
      setMessage('Invalid remote branch format')
      return
    }

    setConfirmModalProps({
      title: 'Delete Remote Branch?',
      message: `Are you sure you want to delete remote branch "${branch}" on "${remote}"? This will affect all users.`,
      onConfirm: async () => {
        setShowConfirmModal(false)
        try {
          await git.deleteRemoteBranch(remote, branch)
          await loadData(true)
          setMessage(`Deleted remote branch: ${remote}/${branch}`)
        } catch (error) {
          setMessage(`Error deleting remote branch: ${error}`)
        }
      },
      danger: true,
    })
    setShowConfirmModal(true)
  }, [git, loadData])

  const handleRenameBranch = useCallback(async (oldName: string, newName: string) => {
    try {
      await git.renameBranch(oldName, newName)
      await loadData(true)
      setMessage(`Renamed branch: ${oldName} → ${newName}`)
      setShowBranchRenameModal(false)
    } catch (error) {
      setMessage(`Error renaming branch: ${error}`)
      setShowBranchRenameModal(false)
    }
  }, [git, loadData])

  const handleSetUpstream = useCallback(async (branch: string, upstream: string) => {
    try {
      await git.setUpstream(branch, upstream)
      await loadData(true)
      setMessage(`Set upstream for ${branch}: ${upstream}`)
      setShowSetUpstreamModal(false)
    } catch (error) {
      setMessage(`Error setting upstream: ${error}`)
      setShowSetUpstreamModal(false)
    }
  }, [git, loadData])

  const handleUnsetUpstream = useCallback(async (branch: string) => {
    try {
      await git.unsetUpstream(branch)
      await loadData(true)
      setMessage(`Unset upstream for ${branch}`)
    } catch (error) {
      setMessage(`Error unsetting upstream: ${error}`)
    }
  }, [git, loadData])

  const handleMerge = useCallback(async (branch: string, strategy: MergeStrategy) => {
    try {
      setShowMergeModal(false)
      setMessage(`Merging ${branch}...`)
      await git.merge(branch, strategy)
      await loadData(true)
      
      // Check if there are conflicts
      const newMergeState = await git.getMergeState()
      if (newMergeState.inProgress && newMergeState.conflicts.length > 0) {
        setMergeState(newMergeState)
        setShowConflictModal(true)
        setMessage(`Merge conflicts detected (${newMergeState.conflicts.length} files)`)
      } else {
        setMessage(`Successfully merged ${branch}`)
      }
    } catch (error) {
      setMessage(`Merge failed: ${error}`)
    }
  }, [git, loadData])

  const handleAbortMerge = useCallback(async () => {
    try {
      await git.abortMerge()
      await loadData(true)
      setShowConflictModal(false)
      setMessage('Merge aborted')
    } catch (error) {
      setMessage(`Error aborting merge: ${error}`)
    }
  }, [git, loadData])

  const handleResolveConflict = useCallback(async (path: string, resolution: 'ours' | 'theirs' | 'manual') => {
    try {
      await git.resolveConflict(path, resolution)
      await loadData(true)
      setMessage(`Resolved ${path} using ${resolution}`)
    } catch (error) {
      setMessage(`Error resolving conflict: ${error}`)
    }
  }, [git, loadData])

  const handleEditConflict = useCallback(async (path: string, content: string) => {
    try {
      await git.writeConflictedFileContent(path, content)
      setMessage(`Edited ${path}`)
    } catch (error) {
      setMessage(`Error editing conflict: ${error}`)
    }
  }, [git])

  const handleStageResolved = useCallback(async (path: string) => {
    try {
      await git.stageFile(path)
      await loadData(true)
      setMessage(`Staged resolved file: ${path}`)
    } catch (error) {
      setMessage(`Error staging file: ${error}`)
    }
  }, [git, loadData])

  const handleContinueMerge = useCallback(async (commitMessage: string) => {
    try {
      await git.continueMerge(commitMessage)
      await loadData(true)
      setShowConflictModal(false)
      setMessage('Merge completed successfully')
    } catch (error) {
      setMessage(`Error completing merge: ${error}`)
    }
  }, [git, loadData])

  const handleCherryPick = useCallback(async (commitHash: string) => {
    try {
      await git.cherryPick(commitHash)
      await loadData(true)
      setMessage(`Cherry-picked commit ${commitHash}`)
    } catch (error) {
      setMessage(`Error cherry-picking: ${error}`)
    }
  }, [git, loadData])

  const handleRevert = useCallback(async (commitHash: string) => {
    try {
      await git.revertCommit(commitHash)
      await loadData(true)
      setMessage(`Reverted commit ${commitHash}`)
    } catch (error) {
      setMessage(`Error reverting: ${error}`)
    }
  }, [git, loadData])

  const handleAmend = useCallback(async (commitMessage: string) => {
    try {
      await git.amendCommit(commitMessage)
      await loadData(true)
      setMessage('Amended last commit')
    } catch (error) {
      setMessage(`Error amending commit: ${error}`)
    }
  }, [git, loadData])

  const handleReset = useCallback(async (commitHash: string, mode: 'soft' | 'mixed' | 'hard') => {
    try {
      await git.resetToCommit(commitHash, mode)
      await loadData(true)
      setShowResetModal(false)
      setMessage(`Reset to ${commitHash} (${mode})`)
    } catch (error) {
      setMessage(`Error resetting: ${error}`)
      setShowResetModal(false)
    }
  }, [git, loadData])

  const handleViewCommitDiff = useCallback(async (commitHash: string) => {
    try {
      const commitDiff = await git.getCommitDiff(commitHash)
      setDiff(commitDiff)
      setView('diff')
      setMessage(`Viewing commit ${commitHash}`)
    } catch (error) {
      setMessage(`Error loading commit diff: ${error}`)
    }
  }, [git])

  const handleCopyCommitHash = useCallback(async (commitHash: string) => {
    try {
      await git.copyToClipboard(commitHash)
      setMessage(`Copied ${commitHash} to clipboard`)
    } catch (error) {
      setMessage(`Error copying to clipboard: ${error}`)
    }
  }, [git])

  const handleCreateTag = useCallback(async (commitHash: string, tagName: string, message?: string) => {
    try {
      await git.createTag(tagName, commitHash, message)
      await loadData(true)
      setShowTagModal(false)
      setMessage(`Created tag ${tagName} at ${commitHash}`)
    } catch (error) {
      setMessage(`Error creating tag: ${error}`)
      setShowTagModal(false)
    }
  }, [git, loadData])

  const handleAddRemote = useCallback(async (name: string, fetchUrl: string, pushUrl?: string) => {
    try {
      await git.addRemote(name, fetchUrl)
      if (pushUrl && pushUrl !== fetchUrl) {
        await git.setRemoteUrl(name, fetchUrl, pushUrl)
      }
      await loadData(true)
      setShowRemoteModal(false)
      setMessage(`Added remote: ${name}`)
    } catch (error) {
      setMessage(`Error adding remote: ${error}`)
      setShowRemoteModal(false)
    }
  }, [git, loadData])

  const handleEditRemote = useCallback(async (name: string, fetchUrl: string, pushUrl?: string) => {
    try {
      await git.setRemoteUrl(name, fetchUrl, pushUrl)
      await loadData(true)
      setShowRemoteModal(false)
      setMessage(`Updated remote: ${name}`)
    } catch (error) {
      setMessage(`Error updating remote: ${error}`)
      setShowRemoteModal(false)
    }
  }, [git, loadData])

  const handleRemoveRemote = useCallback(async (name: string) => {
    try {
      await git.removeRemote(name)
      await loadData(true)
      setMessage(`Removed remote: ${name}`)
    } catch (error) {
      setMessage(`Error removing remote: ${error}`)
    }
  }, [git, loadData])

  const handleRemoveRemoteWithConfirm = useCallback((name: string) => {
    setConfirmModalProps({
      title: 'Remove Remote?',
      message: `Are you sure you want to remove remote "${name}"?`,
      onConfirm: () => {
        setShowConfirmModal(false)
        void handleRemoveRemote(name)
      },
      danger: true,
    })
    setShowConfirmModal(true)
  }, [handleRemoveRemote])

  const handleFetchRemote = useCallback(async (name: string) => {
    try {
      setMessage(`Fetching from ${name}...`)
      await git.fetch()
      await loadData(true)
      setMessage(`Fetch from ${name} completed`)
    } catch (error) {
      setMessage(`Error fetching from ${name}: ${error}`)
    }
  }, [git, loadData])

  const getMaxIndex = useCallback(() => {
    switch (view) {
      case 'main':
        if (focusedPanel === 'status') {
          return status.staged.length + status.unstaged.length + status.untracked.length - 1
        } else if (focusedPanel === 'branches') {
          return branches.filter((b) => !b.remote).length - 1
        } else if (focusedPanel === 'stashes') {
          return Math.min(stashes.length - 1, 2) // Only show first 3 stashes in sidebar
        } else if (focusedPanel === 'remotes') {
          return remotes.length - 1
        } else if (focusedPanel === 'tags') {
          return Math.min(tags.length - 1, 14) // Show max 15 tags (0-14)
        } else if (focusedPanel === 'diff') {
          return 0 // Diff panel is not selectable (uses scrolling)
        } else {
          return Math.min(commits.length - 1, 9) // log panel shows max 10 commits
        }
      case 'log':
        return commits.length - 1
      case 'stash':
        return stashes.length - 1
      case 'remotes':
        return remotes.length - 1
      default:
        return 0
    }
  }, [view, focusedPanel, status, commits, branches, stashes, remotes, tags])

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
      id: 'toggle-command-log',
      label: 'Toggle Command Log',
      description: 'Show/hide git command history panel',
      shortcut: '`',
      execute: () => setShowCommandLog((prev) => !prev),
    },
    {
      id: 'stage-all',
      label: 'Stage All Changes',
      description: 'Stage all modified and untracked files',
      shortcut: 'a',
      execute: () => void handleStageAll(),
    },
    {
      id: 'unstage-all',
      label: 'Unstage All Changes',
      description: 'Unstage all staged files',
      shortcut: 'A',
      execute: () => handleUnstageAllWithConfirm(),
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
      id: 'view-remotes',
      label: 'View: Remotes',
      description: 'Show remotes list',
      shortcut: '5',
      execute: () => {
        setView('remotes')
        setSelectedIndex(0)
      },
    },
    {
      id: 'panel-status',
      label: 'Panel: Files',
      description: 'Focus files panel',
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
      label: 'Panel: Commits',
      description: 'Focus commits panel',
      shortcut: '\\',
      execute: () => {
        setView('main')
        setFocusedPanel('log')
        setSelectedIndex(0)
      },
    },
    {
      id: 'panel-stashes',
      label: 'Panel: Stashes',
      description: 'Focus stashes panel',
      shortcut: '|',
      execute: () => {
        setView('main')
        setFocusedPanel('stashes')
        setSelectedIndex(0)
      },
    },
    {
      id: 'panel-remotes',
      label: 'Panel: Remotes',
      description: 'Focus remotes panel',
      shortcut: '}',
      execute: () => {
        setView('main')
        setFocusedPanel('remotes')
        setSelectedIndex(0)
      },
    },
    {
      id: 'panel-tags',
      label: 'Panel: Tags',
      description: 'Focus tags panel',
      execute: () => {
        setView('main')
        setFocusedPanel('tags')
        setSelectedIndex(0)
      },
    },
    {
      id: 'cycle-panels',
      label: 'Cycle Through Panels',
      description: 'Navigate to next panel with Tab key',
      shortcut: 'TAB / Shift+TAB',
      execute: () => {
        if (view === 'main') {
          const panels: Array<'status' | 'branches' | 'log' | 'stashes' | 'remotes' | 'tags' | 'diff'> = stashes.length > 0
            ? ['status', 'branches', 'stashes', 'log', 'diff']
            : ['status', 'branches', 'log', 'diff']
          
          const currentIndex = panels.indexOf(focusedPanel)
          const nextIndex = (currentIndex + 1) % panels.length
          setFocusedPanel(panels[nextIndex]!)
          setSelectedIndex(0)
        }
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
      id: 'discard-changes',
      label: 'Discard Changes',
      description: 'Discard changes to selected unstaged file',
      shortcut: 'd',
      execute: () => {
        if (view === 'main' && focusedPanel === 'status') {
          const file = status.unstaged[selectedIndex]
          if (file) {
            handleDiscardWithConfirm(file.path)
          } else {
            setMessage('No unstaged file selected')
          }
        }
      },
    },
    {
      id: 'delete-untracked',
      label: 'Delete Untracked File',
      description: 'Delete selected untracked file',
      shortcut: 'D',
      execute: () => {
        if (view === 'main' && focusedPanel === 'status') {
          const untrackedIndex = selectedIndex - status.staged.length - status.unstaged.length
          const file = status.untracked[untrackedIndex]
          if (file && untrackedIndex >= 0) {
            handleDeleteWithConfirm(file.path)
          } else {
            setMessage('No untracked file selected')
          }
        }
      },
    },
    {
      id: 'rename-file',
      label: 'Rename/Move File',
      description: 'Rename or move selected file through git',
      shortcut: 'r',
      execute: () => {
        if (view === 'main' && focusedPanel === 'status') {
          const allFiles = [...status.staged, ...status.unstaged, ...status.untracked]
          const file = allFiles[selectedIndex]
          if (file) {
            handleRenameWithModal(file.path)
          } else {
            setMessage('No file selected')
          }
        }
      },
    },
    {
      id: 'create-branch',
      label: 'Create Branch',
      description: 'Create a new branch from current HEAD or commit',
      shortcut: 'n (in branches panel)',
      execute: () => setShowBranchModal(true),
    },
    {
      id: 'delete-branch',
      label: 'Delete Branch',
      description: 'Delete selected local branch with safety checks',
      shortcut: 'D (in branches panel)',
      execute: () => {
        if (view === 'main' && focusedPanel === 'branches') {
          const localBranches = branches.filter((b) => !b.remote)
          const branch = localBranches[selectedIndex]
          if (branch && !branch.current) {
            handleDeleteBranch(branch.name)
          } else if (branch?.current) {
            setMessage('Cannot delete current branch')
          } else {
            setMessage('No branch selected')
          }
        }
      },
    },
    {
      id: 'rename-branch',
      label: 'Rename Branch',
      description: 'Rename selected branch',
      shortcut: 'R (in branches panel)',
      execute: () => {
        if (view === 'main' && focusedPanel === 'branches') {
          const localBranches = branches.filter((b) => !b.remote)
          const branch = localBranches[selectedIndex]
          if (branch) {
            setBranchToRename(branch.name)
            setShowBranchRenameModal(true)
          } else {
            setMessage('No branch selected')
          }
        }
      },
    },
    {
      id: 'set-upstream',
      label: 'Set Upstream Branch',
      description: 'Set tracking upstream for selected branch',
      shortcut: 'u (in branches panel)',
      execute: () => {
        if (view === 'main' && focusedPanel === 'branches') {
          const localBranches = branches.filter((b) => !b.remote)
          const branch = localBranches[selectedIndex]
          if (branch) {
            setBranchForUpstream(branch.name)
            setShowSetUpstreamModal(true)
          } else {
            setMessage('No branch selected')
          }
        }
      },
    },
    {
      id: 'unset-upstream',
      label: 'Unset Upstream Branch',
      description: 'Remove tracking upstream from selected branch',
      shortcut: 'U (in branches panel)',
      execute: () => {
        if (view === 'main' && focusedPanel === 'branches') {
          const localBranches = branches.filter((b) => !b.remote)
          const branch = localBranches[selectedIndex]
          if (branch && branch.upstream) {
            void handleUnsetUpstream(branch.name)
          } else if (branch && !branch.upstream) {
            setMessage('Branch has no upstream set')
          } else {
            setMessage('No branch selected')
          }
        }
      },
    },
    {
      id: 'merge-branch',
      label: 'Merge Branch',
      description: 'Merge another branch into current branch',
      shortcut: 'm',
      execute: () => {
        if (mergeState.inProgress) {
          setMessage('Merge already in progress - resolve conflicts first')
        } else {
          setShowMergeModal(true)
        }
      },
    },
    {
      id: 'resolve-conflicts',
      label: 'Resolve Merge Conflicts',
      description: 'Open conflict resolution interface',
      shortcut: 'C',
      execute: () => {
        if (mergeState.inProgress) {
          setShowConflictModal(true)
        } else {
          setMessage('No merge in progress')
        }
      },
    },
    {
      id: 'abort-merge',
      label: 'Abort Merge',
      description: 'Abort current merge operation',
      execute: () => {
        if (mergeState.inProgress) {
          setConfirmModalProps({
            title: 'Abort Merge?',
            message: 'Are you sure you want to abort the current merge? All conflict resolutions will be lost.',
            onConfirm: () => {
              setShowConfirmModal(false)
              void handleAbortMerge()
            },
            danger: true,
          })
          setShowConfirmModal(true)
        } else {
          setMessage('No merge in progress')
        }
      },
    },
    {
      id: 'cherry-pick',
      label: 'Cherry-pick Commit',
      description: 'Apply changes from selected commit to current branch',
      shortcut: 'y (in log view)',
      execute: () => {
        if (view === 'log' || (view === 'main' && focusedPanel === 'log')) {
          const commit = commits[selectedIndex]
          if (commit) {
            setConfirmModalProps({
              title: 'Cherry-pick Commit?',
              message: `Apply changes from commit ${commit.shortHash}: ${commit.message}`,
              onConfirm: () => {
                setShowConfirmModal(false)
                void handleCherryPick(commit.hash)
              },
              danger: false,
            })
            setShowConfirmModal(true)
          }
        }
      },
    },
    {
      id: 'revert-commit',
      label: 'Revert Commit',
      description: 'Create new commit that undoes selected commit',
      shortcut: 'R (in log view)',
      execute: () => {
        if (view === 'log' || (view === 'main' && focusedPanel === 'log')) {
          const commit = commits[selectedIndex]
          if (commit) {
            setConfirmModalProps({
              title: 'Revert Commit?',
              message: `Create a new commit that undoes ${commit.shortHash}: ${commit.message}`,
              onConfirm: () => {
                setShowConfirmModal(false)
                void handleRevert(commit.hash)
              },
              danger: false,
            })
            setShowConfirmModal(true)
          }
        }
      },
    },
    {
      id: 'amend-commit',
      label: 'Amend Last Commit',
      description: 'Modify the last commit with staged changes',
      shortcut: 'A (with staged changes)',
      execute: () => {
        if (status.staged.length > 0) {
          setConfirmModalProps({
            title: 'Amend Last Commit?',
            message: `Add staged changes to the last commit? This will change commit history.`,
            onConfirm: () => {
              setShowConfirmModal(false)
              const lastCommit = commits[0]
              if (lastCommit) {
                void handleAmend(lastCommit.message)
              }
            },
            danger: true,
          })
          setShowConfirmModal(true)
        } else {
          setMessage('No staged changes to amend')
        }
      },
    },
    {
      id: 'reset-to-commit',
      label: 'Reset to Commit',
      description: 'Reset current branch to selected commit',
      shortcut: 'X (in log view)',
      execute: () => {
        if (view === 'log' || (view === 'main' && focusedPanel === 'log')) {
          const commit = commits[selectedIndex]
          if (commit) {
            setSelectedCommitForAction(commit)
            setShowResetModal(true)
          }
        }
      },
    },
    {
      id: 'view-commit-diff',
      label: 'View Commit Diff',
      description: 'Show changes introduced by commit',
      shortcut: 'Enter (in log view)',
      execute: () => {
        if (view === 'log' || (view === 'main' && focusedPanel === 'log')) {
          const commit = commits[selectedIndex]
          if (commit) {
            void handleViewCommitDiff(commit.hash)
          }
        }
      },
    },
    {
      id: 'copy-commit-hash',
      label: 'Copy Commit Hash',
      description: 'Copy commit hash to clipboard',
      shortcut: 'Y (in log view)',
      execute: () => {
        if (view === 'log' || (view === 'main' && focusedPanel === 'log')) {
          const commit = commits[selectedIndex]
          if (commit) {
            void handleCopyCommitHash(commit.hash)
          }
        }
      },
    },
    {
      id: 'create-tag',
      label: 'Create Tag',
      description: 'Create a tag at selected commit',
      shortcut: 't (in log view)',
      execute: () => {
        if (view === 'log' || (view === 'main' && focusedPanel === 'log')) {
          const commit = commits[selectedIndex]
          if (commit) {
            setSelectedCommitForAction(commit)
            setShowTagModal(true)
          }
        }
      },
    },
    {
      id: 'add-remote',
      label: 'Add Remote',
      description: 'Add a new remote repository',
      shortcut: 'n (in remotes panel)',
      execute: () => {
        setRemoteModalMode('add')
        setRemoteToEdit(undefined)
        setShowRemoteModal(true)
      },
    },
    {
      id: 'edit-remote',
      label: 'Edit Remote',
      description: 'Edit selected remote URL',
      shortcut: 'e (in remotes panel)',
      execute: () => {
        if ((view === 'main' && focusedPanel === 'remotes') || view === 'remotes') {
          const remote = remotes[selectedIndex]
          if (remote) {
            setRemoteModalMode('edit')
            setRemoteToEdit(remote)
            setShowRemoteModal(true)
          }
        }
      },
    },
    {
      id: 'remove-remote',
      label: 'Remove Remote',
      description: 'Remove selected remote',
      shortcut: 'D (in remotes panel)',
      execute: () => {
        if ((view === 'main' && focusedPanel === 'remotes') || view === 'remotes') {
          const remote = remotes[selectedIndex]
          if (remote) {
            handleRemoveRemoteWithConfirm(remote.name)
          }
        }
      },
    },
    {
      id: 'show-git-version',
      label: 'Show Git Version',
      description: 'Display the git version being used',
      execute: async () => {
        try {
          const version = await git.getVersion()
          setMessage(version)
        } catch (error) {
          setMessage(`Error getting git version: ${error}`)
        }
      },
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
    if (showExitModal || showCommandPalette || showSettingsModal || showProgressModal || showConfirmModal || showRenameModal || showBranchModal || showBranchRenameModal || showSetUpstreamModal || showMergeModal || showConflictModal || showResetModal || showTagModal || showRemoteModal) {
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

    // Toggle command log with '`' key (backtick)
    if (key.sequence === '`') {
      setShowCommandLog((prev) => !prev)
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
    } else if (key.sequence === '5') {
      setView('remotes')
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
      } else if (key.sequence === '|') {
        setFocusedPanel('stashes')
        setSelectedIndex(0)
      } else if (key.sequence === '}') {
        setFocusedPanel('remotes')
        setSelectedIndex(0)
      }
      
      // Tab key to cycle through panels (forward with Tab, backward with Shift+Tab)
      if (key.name === 'tab') {
        const panels: Array<'status' | 'branches' | 'log' | 'stashes' | 'remotes' | 'tags' | 'diff'> = stashes.length > 0
          ? ['status', 'branches', 'stashes', 'log', 'diff']
          : ['status', 'branches', 'log', 'diff']
        
        const currentIndex = panels.indexOf(focusedPanel)
        
        // Shift+Tab goes backward, Tab goes forward
        const nextIndex = key.shift
          ? (currentIndex - 1 + panels.length) % panels.length
          : (currentIndex + 1) % panels.length
        
        setFocusedPanel(panels[nextIndex]!)
        setSelectedIndex(0)
      }
      
      // Switch between Branches/Remotes/Tags tabs with left/right arrow when panel is focused
      if (focusedPanel === 'branches' || focusedPanel === 'remotes' || focusedPanel === 'tags') {
        if (key.name === 'left') {
          // Cycle left: tags -> remotes -> branches -> tags
          if (branchRemoteTab === 'branches') {
            setBranchRemoteTab('tags')
            setFocusedPanel('tags')
          } else if (branchRemoteTab === 'remotes') {
            setBranchRemoteTab('branches')
            setFocusedPanel('branches')
          } else if (branchRemoteTab === 'tags') {
            setBranchRemoteTab('remotes')
            setFocusedPanel('remotes')
          }
          setSelectedIndex(0)
        } else if (key.name === 'right') {
          // Cycle right: branches -> remotes -> tags -> branches
          if (branchRemoteTab === 'branches') {
            setBranchRemoteTab('remotes')
            setFocusedPanel('remotes')
          } else if (branchRemoteTab === 'remotes') {
            setBranchRemoteTab('tags')
            setFocusedPanel('tags')
          } else if (branchRemoteTab === 'tags') {
            setBranchRemoteTab('branches')
            setFocusedPanel('branches')
          }
          setSelectedIndex(0)
        }
      }
    }

    // Navigation (only for views with selectable items, not diff view)
    if (view !== 'diff') {
      if (key.name === 'up') {
        setSelectedIndex((prev) => Math.max(0, prev - 1))
      } else if (key.name === 'down') {
        const max = getMaxIndex()
        setSelectedIndex((prev) => Math.min(max, prev + 1))
      }
    }

    // Actions
    if (key.name === 'return') {
      if (view === 'main' && focusedPanel === 'branches' && branchRemoteTab === 'branches') {
        const localBranches = branches.filter((b) => !b.remote)
        const branch = localBranches[selectedIndex]
        if (branch && !branch.current) {
          void handleCheckout(branch.name)
        }
      }
    }

    // Branch operations (when in branches panel and branches tab is active)
    if (view === 'main' && focusedPanel === 'branches' && branchRemoteTab === 'branches') {
      const localBranches = branches.filter((b) => !b.remote)
      const branch = localBranches[selectedIndex]

      // 'n' key to create new branch
      if (key.sequence === 'n') {
        setShowBranchModal(true)
      }

      // 'D' key to delete branch
      if (key.sequence === 'D' && branch && !branch.current) {
        handleDeleteBranch(branch.name)
      }

      // 'R' key to rename branch
      if (key.sequence === 'R' && branch) {
        setBranchToRename(branch.name)
        setShowBranchRenameModal(true)
      }

      // 'u' key to set upstream
      if (key.sequence === 'u' && branch) {
        setBranchForUpstream(branch.name)
        setShowSetUpstreamModal(true)
      }

      // 'U' key to unset upstream
      if (key.sequence === 'U' && branch && branch.upstream) {
        void handleUnsetUpstream(branch.name)
      }
    }

    // Stash operations (when in stashes panel)
    if (view === 'main' && focusedPanel === 'stashes') {
      const stash = stashes[selectedIndex]

      if (stash && key.name === 'return') {
        // Apply stash on Enter
        void handleApplyStash(stash.index)
      } else if (stash && key.sequence === 'P') {
        // Pop stash on Shift+P
        void handlePopStash(stash.index)
      } else if (stash && key.sequence === 'D') {
        // Drop stash on Shift+D
        handleDropStashWithConfirm(stash.index, stash.name, stash.message)
      } else if (stash && key.sequence === 'V') {
        // View stash diff on Shift+V
        void handleViewStashDiff(stash.index)
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

    // 'd' key to discard changes to unstaged files
    if (key.sequence === 'd') {
      if (view === 'main' && focusedPanel === 'status') {
        const file = status.unstaged[selectedIndex]
        if (file) {
          handleDiscardWithConfirm(file.path)
        }
      }
    }

    // 'D' key (shift+d) to delete untracked files
    if (key.sequence === 'D') {
      if (view === 'main' && focusedPanel === 'status') {
        const untrackedIndex = selectedIndex - status.staged.length - status.unstaged.length
        const file = status.untracked[untrackedIndex]
        if (file && untrackedIndex >= 0) {
          handleDeleteWithConfirm(file.path)
        }
      }
    }

    // 'r' key to rename/move file
    if (key.sequence === 'r') {
      if (view === 'main' && focusedPanel === 'status') {
        const allFiles = [...status.staged, ...status.unstaged, ...status.untracked]
        const file = allFiles[selectedIndex]
        if (file) {
          handleRenameWithModal(file.path)
        }
      }
    }

    // 'A' key (shift+a) to unstage all
    if (key.sequence === 'A') {
      handleUnstageAllWithConfirm()
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

    // Merge operations
    if (key.sequence === 'm') {
      if (mergeState.inProgress) {
        setMessage('Merge already in progress - resolve conflicts first')
      } else {
        setShowMergeModal(true)
      }
    }

    if (key.sequence === 'C') {
      if (mergeState.inProgress) {
        setShowConflictModal(true)
      } else {
        setMessage('No merge in progress')
      }
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
        handleDropStashWithConfirm(stash.index, stash.name, stash.message)
      } else if (stash && key.sequence === 'V') {
        // View stash diff on Shift+V
        void handleViewStashDiff(stash.index)
      }
    }

    // Remotes view and panel actions
    if ((view === 'remotes' || (view === 'main' && focusedPanel === 'remotes')) && remotes.length > 0) {
      const remote = remotes[selectedIndex]
      
      if (remote && key.name === 'return') {
        // Fetch from remote on Enter
        void handleFetchRemote(remote.name)
      } else if (key.sequence === 'n') {
        // Add new remote on 'n'
        setRemoteModalMode('add')
        setRemoteToEdit(undefined)
        setShowRemoteModal(true)
      } else if (remote && key.sequence === 'e') {
        // Edit remote on 'e'
        setRemoteModalMode('edit')
        setRemoteToEdit(remote)
        setShowRemoteModal(true)
      } else if (remote && key.sequence === 'D') {
        // Delete remote on Shift+D
        handleRemoveRemoteWithConfirm(remote.name)
      }
    } else if ((view === 'remotes' || (view === 'main' && focusedPanel === 'remotes')) && remotes.length === 0) {
      // Allow adding remotes even when list is empty
      if (key.sequence === 'n') {
        setRemoteModalMode('add')
        setRemoteToEdit(undefined)
        setShowRemoteModal(true)
      }
    }

    // Log view actions
    if (view === 'log' || (view === 'main' && focusedPanel === 'log')) {
      const commit = commits[selectedIndex]
      
      if (commit && key.name === 'return') {
        // View commit diff on Enter
        void handleViewCommitDiff(commit.hash)
      } else if (commit && key.sequence === 'y') {
        // Cherry-pick on 'y'
        setConfirmModalProps({
          title: 'Cherry-pick Commit?',
          message: `Apply changes from commit ${commit.shortHash}: ${commit.message}`,
          onConfirm: () => {
            setShowConfirmModal(false)
            void handleCherryPick(commit.hash)
          },
          danger: false,
        })
        setShowConfirmModal(true)
      } else if (commit && key.sequence === 'R') {
        // Revert on Shift+R
        setConfirmModalProps({
          title: 'Revert Commit?',
          message: `Create a new commit that undoes ${commit.shortHash}: ${commit.message}`,
          onConfirm: () => {
            setShowConfirmModal(false)
            void handleRevert(commit.hash)
          },
          danger: false,
        })
        setShowConfirmModal(true)
      } else if (commit && key.sequence === 'X') {
        // Reset on Shift+X
        setSelectedCommitForAction(commit)
        setShowResetModal(true)
      } else if (commit && key.sequence === 'Y') {
        // Copy hash on Shift+Y
        void handleCopyCommitHash(commit.hash)
      } else if (commit && key.sequence === 't') {
        // Create tag on 't'
        setSelectedCommitForAction(commit)
        setShowTagModal(true)
      }
    }
  })

  const handleViewChange = useCallback((newView: View) => {
    setView(newView)
    setSelectedIndex(0)
  }, [])

  return (
    <box width="100%" height="100%" flexDirection="column" backgroundColor={theme.colors.background.primary}>
      <Header
        branch={status.branch}
        ahead={status.ahead}
        behind={status.behind}
        view={view}
        onViewChange={handleViewChange}
      />
      
      {view === 'main' && (
        <MainView
          staged={status.staged}
          unstaged={status.unstaged}
          untracked={status.untracked}
          branches={branches}
          commits={commits}
          stashes={stashes}
          remotes={remotes}
          tags={tags}
          selectedIndex={selectedIndex}
          focusedPanel={focusedPanel}
          branchRemoteTab={branchRemoteTab}
          onStage={handleStage}
          onUnstage={handleUnstage}
          mergeState={mergeState}
          currentBranch={status.branch}
          ahead={status.ahead}
          behind={status.behind}
          diff={diff}
          selectedFilePath={selectedFilePath}
          commandLog={commandLog}
          showCommandLog={showCommandLog}
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
        <box flexDirection="column" flexGrow={1} width="100%">
          <DiffView
            diff={diff}
            focused={!showCommitModal && !showStashModal}
          />
          {showCommandLog && (
            <CommandLogView commandLog={commandLog} maxHeight={10} />
          )}
        </box>
      )}

      {view === 'stash' && (
        <box flexDirection="column" flexGrow={1} width="100%">
          <StashView
            stashes={stashes}
            selectedIndex={selectedIndex}
            focused={!showCommitModal && !showStashModal}
          />
          {showCommandLog && (
            <CommandLogView commandLog={commandLog} maxHeight={10} />
          )}
        </box>
      )}

      {view === 'remotes' && (
        <RemotesView
          remotes={remotes}
          selectedIndex={selectedIndex}
          focused={!showRemoteModal}
        />
      )}

      <Footer 
        message={loading ? 'Loading...' : message}
        view={view}
        focusedPanel={focusedPanel}
        hasStaged={status.staged.length > 0}
        hasUnstaged={status.unstaged.length > 0}
        hasUntracked={status.untracked.length > 0}
        hasStashes={stashes.length > 0}
        mergeInProgress={mergeState.inProgress}
      />

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

      {showConfirmModal && (
        <ConfirmModal
          title={confirmModalProps.title}
          message={confirmModalProps.message}
          onConfirm={confirmModalProps.onConfirm}
          onCancel={() => setShowConfirmModal(false)}
          danger={confirmModalProps.danger}
        />
      )}

      {showRenameModal && (
        <RenameModal
          currentPath={renameFilePath}
          onRename={(newPath) => void handleRenameFile(renameFilePath, newPath)}
          onCancel={() => setShowRenameModal(false)}
        />
      )}

      {showBranchModal && (
        <BranchModal
          onCreateBranch={handleCreateBranch}
          onCancel={() => setShowBranchModal(false)}
          currentCommit={commits[0]?.shortHash}
        />
      )}

      {showBranchRenameModal && (
        <BranchRenameModal
          currentName={branchToRename}
          onRenameBranch={handleRenameBranch}
          onCancel={() => setShowBranchRenameModal(false)}
        />
      )}

      {showSetUpstreamModal && (
        <SetUpstreamModal
          branch={branchForUpstream}
          remoteBranches={branches.filter((b) => b.remote)}
          onSetUpstream={handleSetUpstream}
          onCancel={() => setShowSetUpstreamModal(false)}
        />
      )}

      {showMergeModal && (
        <MergeModal
          branches={branches}
          currentBranch={status.branch}
          onMerge={handleMerge}
          onCancel={() => setShowMergeModal(false)}
        />
      )}

      {showConflictModal && mergeState.inProgress && (
        <ConflictResolutionModal
          conflicts={mergeState.conflicts}
          currentBranch={mergeState.currentBranch}
          mergingBranch={mergeState.mergingBranch || 'unknown'}
          onResolve={handleResolveConflict}
          onEditConflict={handleEditConflict}
          onStageResolved={handleStageResolved}
          onAbort={handleAbortMerge}
          onContinue={handleContinueMerge}
          onClose={() => setShowConflictModal(false)}
        />
      )}

      {showResetModal && selectedCommitForAction && (
        <ResetModal
          commitHash={selectedCommitForAction.shortHash}
          commitMessage={selectedCommitForAction.message}
          onReset={(mode) => handleReset(selectedCommitForAction.hash, mode)}
          onCancel={() => setShowResetModal(false)}
        />
      )}

      {showTagModal && selectedCommitForAction && (
        <TagModal
          commitHash={selectedCommitForAction.shortHash}
          commitMessage={selectedCommitForAction.message}
          onCreateTag={(tagName, message) => handleCreateTag(selectedCommitForAction.hash, tagName, message)}
          onCancel={() => setShowTagModal(false)}
        />
      )}

      {showRemoteModal && (
        <RemoteModal
          mode={remoteModalMode}
          existingRemote={remoteToEdit}
          onSubmit={remoteModalMode === 'add' ? handleAddRemote : handleEditRemote}
          onCancel={() => setShowRemoteModal(false)}
        />
      )}
    </box>
  )
}
