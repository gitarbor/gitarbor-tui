import { useState, useEffect, useCallback } from 'react';
import { useKeyboard, useRenderer } from '@opentui/react';
import { theme, onThemeChange } from './theme';
import { GitClient } from './utils/git';
import { FileSystemWatcher } from './utils/watcher';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MainView } from './components/MainView';
import { HistoryView } from './components/HistoryView';
import { DiffView } from './components/DiffView';
import { CommitModal } from './components/CommitModal';
import { ExitModal } from './components/ExitModal';
import { SettingsModal } from './components/SettingsModal';
import { ConfigModal } from './components/ConfigModal';
import { ThemesModal } from './components/ThemesModal';
import { ProgressModal } from './components/ProgressModal';
import { StashView } from './components/StashView';
import { StashModal } from './components/StashModal';
import { ConfirmModal } from './components/ConfirmModal';
import { RenameModal } from './components/RenameModal';
import { BranchModal } from './components/BranchModal';
import { BranchRenameModal } from './components/BranchRenameModal';
import { SetUpstreamModal } from './components/SetUpstreamModal';
import { MergeModal } from './components/MergeModal';
import { ConflictResolutionModal } from './components/ConflictResolutionModal';
import { ResetModal } from './components/ResetModal';
import { TagModal } from './components/TagModal';
import { RemoteModal } from './components/RemoteModal';
import { PublishBranchModal } from './components/PublishBranchModal';
import { RemotesView } from './components/RemotesView';
import { TagDetailsView } from './components/TagDetailsView';
import { ActivityLog } from './components/ActivityLog';
import { ReposView } from './components/ReposView';
import { RepoSwitchModal } from './components/RepoSwitchModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { WorkspaceManager } from './utils/workspace';
import type { Repository } from './types/workspace';
import type {
  GitStatus,
  GitCommit,
  GitBranch,
  GitStash,
  GitRemote,
  GitTag,
  GitMergeState,
  MergeStrategy,
  View,
  ActivityLogEntry,
  NotificationType,
} from './types/git';
import type { Command } from './types/commands';

export function App({ cwd }: { cwd: string }) {
  const renderer = useRenderer();
  const [currentRepoPath, setCurrentRepoPath] = useState(cwd);
  const [git, setGit] = useState(() => new GitClient(cwd));
  const [watcher, setWatcher] = useState(() => new FileSystemWatcher(cwd, () => {}));
  const [workspaceManager] = useState(() => new WorkspaceManager());
  const [repos, setRepos] = useState<Repository[]>([]);
  const [repoFilterQuery, setRepoFilterQuery] = useState('');
  const [repoFocusedPanel, setRepoFocusedPanel] = useState<'filter' | 'repos'>('repos');
  const [showRepoSwitchModal, setShowRepoSwitchModal] = useState(false);
  const [showKeyboardShortcutsModal, setShowKeyboardShortcutsModal] = useState(false);
  const [pendingRepoSwitch, setPendingRepoSwitch] = useState<string | null>(null);
  const [view, setView] = useState<View>('main');
  const [focusedPanel, setFocusedPanel] = useState<
    'status' | 'branches' | 'log' | 'stashes' | 'remotes' | 'tags' | 'diff'
  >('status');
  const [branchRemoteTab, setBranchRemoteTab] = useState<'branches' | 'remotes' | 'tags'>(
    'branches',
  );
  const [status, setStatus] = useState<GitStatus>({
    branch: '',
    ahead: 0,
    behind: 0,
    staged: [],
    unstaged: [],
    untracked: [],
  });
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [branches, setBranches] = useState<GitBranch[]>([]);
  const [stashes, setStashes] = useState<GitStash[]>([]);
  const [remotes, setRemotes] = useState<GitRemote[]>([]);
  const [tags, setTags] = useState<GitTag[]>([]);
  const [diff, setDiff] = useState<string>('');
  const [selectedFilePath, setSelectedFilePath] = useState<string | undefined>(undefined);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [showStashModal, setShowStashModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showThemesModal, setShowThemesModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressTitle, setProgressTitle] = useState('');
  const [progressMessages, setProgressMessages] = useState<string[]>([]);
  const [progressComplete, setProgressComplete] = useState(false);
  const [progressError, setProgressError] = useState<string | undefined>(undefined);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalProps, setConfirmModalProps] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    danger?: boolean;
  }>({ title: '', message: '', onConfirm: () => {} });
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameFilePath, setRenameFilePath] = useState('');
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showBranchRenameModal, setShowBranchRenameModal] = useState(false);
  const [branchToRename, setBranchToRename] = useState('');
  const [showSetUpstreamModal, setShowSetUpstreamModal] = useState(false);
  const [branchForUpstream, setBranchForUpstream] = useState('');
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [mergeState, setMergeState] = useState<GitMergeState>({
    inProgress: false,
    currentBranch: '',
    conflicts: [],
  });
  const [showResetModal, setShowResetModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showRemoteModal, setShowRemoteModal] = useState(false);
  const [remoteModalMode, setRemoteModalMode] = useState<'add' | 'edit'>('add');
  const [remoteToEdit, setRemoteToEdit] = useState<GitRemote | undefined>(undefined);
  const [showPublishBranchModal, setShowPublishBranchModal] = useState(false);
  const [publishBranchInfo, setPublishBranchInfo] = useState<{
    branch: string;
    remote: string;
  }>({ branch: '', remote: 'origin' });
  const [selectedCommitForAction, setSelectedCommitForAction] = useState<GitCommit | null>(null);
  const [commandLog, setCommandLog] = useState<ActivityLogEntry[]>([]);
  const [showCommandLog, setShowCommandLog] = useState(true);
  const [, forceUpdate] = useState({});
  const [isLoadingDiff, setIsLoadingDiff] = useState(false);

  // Listen for theme changes and force re-render
  useEffect(() => {
    const unsubscribe = onThemeChange(() => {
      forceUpdate({}); // Trigger re-render when theme changes
    });
    return unsubscribe;
  }, []);

  // Reinitialize git client and watcher when repo path changes
  useEffect(() => {
    // Stop old watcher
    watcher.stop();

    // Create new instances for the new repo path
    const newGit = new GitClient(currentRepoPath);
    const newWatcher = new FileSystemWatcher(currentRepoPath, () => {});

    setGit(newGit);
    setWatcher(newWatcher);

    // Cleanup on unmount or when changing repos
    return () => {
      newWatcher.stop();
    };
  }, [currentRepoPath]);

  // Track current repo in history and load repo list
  useEffect(() => {
    void (async () => {
      try {
        await workspaceManager.initialize();
        await workspaceManager.addRepository(currentRepoPath);
        setRepos(workspaceManager.getConfig().recentRepositories);
      } catch (error) {
        notify(`Failed to load workspace: ${error}`);
      }
    })();
  }, [workspaceManager, currentRepoPath]);

  // Clean exit handler
  const handleExit = useCallback(() => {
    const cleanExit = (globalThis as any).__gitarborCleanExit;
    if (cleanExit) {
      cleanExit();
    } else {
      // Fallback if global not available
      renderer.destroy();
      process.exit(0);
    }
  }, [renderer]);

  // Smart notification that infers type from message and logs to activity
  const notify = useCallback(
    (message: string) => {
      const lowerMessage = message.toLowerCase();
      let type: NotificationType = 'info';

      if (lowerMessage.includes('error') || lowerMessage.startsWith('failed')) {
        type = 'error';
      } else if (
        lowerMessage.includes('success') ||
        lowerMessage.startsWith('staged') ||
        lowerMessage.startsWith('unstaged') ||
        lowerMessage.startsWith('committed') ||
        lowerMessage.startsWith('push completed') ||
        lowerMessage.startsWith('pull completed') ||
        lowerMessage.startsWith('fetch completed') ||
        lowerMessage.startsWith('applied') ||
        lowerMessage.startsWith('popped') ||
        lowerMessage.startsWith('dropped') ||
        lowerMessage.startsWith('discarded') ||
        lowerMessage.startsWith('deleted') ||
        lowerMessage.startsWith('renamed') ||
        lowerMessage.startsWith('created') ||
        lowerMessage.startsWith('switched') ||
        lowerMessage.startsWith('merged') ||
        lowerMessage.startsWith('cherry-picked') ||
        lowerMessage.startsWith('reverted') ||
        lowerMessage.startsWith('amended') ||
        lowerMessage.startsWith('reset') ||
        lowerMessage.startsWith('copied') ||
        lowerMessage.startsWith('added') ||
        lowerMessage.startsWith('updated') ||
        lowerMessage.startsWith('removed') ||
        lowerMessage.startsWith('resolved') ||
        lowerMessage.startsWith('edited') ||
        lowerMessage.startsWith('merge completed') ||
        lowerMessage.startsWith('merge aborted') ||
        lowerMessage.startsWith('set upstream') ||
        lowerMessage.startsWith('unset upstream') ||
        lowerMessage.includes('stashed')
      ) {
        type = 'success';
      } else if (
        lowerMessage.startsWith('loading') ||
        lowerMessage.startsWith('pushing') ||
        lowerMessage.startsWith('pulling') ||
        lowerMessage.startsWith('fetching') ||
        lowerMessage.startsWith('switching') ||
        lowerMessage.startsWith('merging') ||
        lowerMessage.startsWith('viewing')
      ) {
        type = 'info';
      } else if (lowerMessage.includes('no files') || lowerMessage.includes('conflict')) {
        type = 'warning';
      }

      // Only log errors and warnings to activity log
      if (type === 'error' || type === 'warning') {
        git.addActivityMessage(message, type);
      }
    },
    [git],
  );

  // Perform the actual repository switch
  const performRepoSwitch = useCallback(
    async (repoPath: string) => {
      try {
        setLoading(true);
        notify(`Switching to ${repoPath}...`);

        // Update the current repo path (this will trigger useEffect to reinitialize git & watcher)
        setCurrentRepoPath(repoPath);

        // Reset all state
        setView('main');
        setFocusedPanel('status');
        setSelectedIndex(0);
        setDiff('');
        setSelectedFilePath(undefined);
        setStatus({
          branch: '',
          ahead: 0,
          behind: 0,
          staged: [],
          unstaged: [],
          untracked: [],
        });
        setCommits([]);
        setBranches([]);
        setStashes([]);
        setRemotes([]);
        setTags([]);

        // Update workspace history
        await workspaceManager.addRepository(repoPath);
        setRepos(workspaceManager.getConfig().recentRepositories);

        notify(`Switched to ${repoPath}`);
      } catch (error) {
        notify(`Failed to switch repository: ${error}`);
      } finally {
        setLoading(false);
      }
    },
    [workspaceManager],
  );

  const handleRepoSwitch = useCallback(
    (repoPath: string) => {
      const hasChanges =
        status.staged.length > 0 || status.unstaged.length > 0 || status.untracked.length > 0;

      if (hasChanges) {
        // Show confirmation modal
        setPendingRepoSwitch(repoPath);
        setShowRepoSwitchModal(true);
      } else {
        // Switch immediately if no changes
        void performRepoSwitch(repoPath);
      }
    },
    [status, performRepoSwitch],
  );

  const handleConfirmRepoSwitch = useCallback(() => {
    if (pendingRepoSwitch) {
      void performRepoSwitch(pendingRepoSwitch);
      setShowRepoSwitchModal(false);
      setPendingRepoSwitch(null);
    }
  }, [pendingRepoSwitch, performRepoSwitch]);

  const loadData = useCallback(
    async (silent: boolean = false) => {
      try {
        if (!silent) {
          setLoading(true);
        }
        const [
          statusData,
          commitsData,
          branchesData,
          stashesData,
          mergeStateData,
          remotesData,
          tagsData,
        ] = await Promise.all([
          git.getStatus(),
          git.getLog(50),
          git.getBranches(),
          git.getStashes(),
          git.getMergeState(),
          git.getRemotes(),
          git.getTags(50), // Limit to 50 most recent tags for performance
        ]);
        setStatus(statusData);
        setCommits(commitsData);
        setBranches(branchesData);
        setStashes(stashesData);
        setMergeState(mergeStateData);
        setRemotes(remotesData);
        setTags(tagsData);

        // Auto-show conflict modal if merge is in progress with conflicts
        if (
          mergeStateData.inProgress &&
          mergeStateData.conflicts.length > 0 &&
          !showConflictModal
        ) {
          setShowConflictModal(true);
        }

        if (!silent) {
          notify('Data loaded');
        }
      } catch (error) {
        notify(`Error: ${error}`);
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [git, showConflictModal],
  );

  const loadDiff = useCallback(async () => {
    try {
      setIsLoadingDiff(true);
      if (view === 'main' && focusedPanel === 'status') {
        // Load diff for selected file in status panel
        const allFiles = [...status.staged, ...status.unstaged, ...status.untracked];
        if (allFiles.length > 0 && selectedIndex < allFiles.length) {
          const file = allFiles[selectedIndex];
          if (file) {
            let diffContent: string;
            if (file.status === 'untracked') {
              // For untracked files, show the file content as a diff
              diffContent = await git.getUntrackedDiff(file.path);
            } else if (file.staged) {
              diffContent = await git.getStagedDiff(file.path);
            } else {
              diffContent = await git.getDiff(file.path);
            }
            setDiff(diffContent);
            setSelectedFilePath(file.path);
          }
        } else {
          setDiff('');
          setSelectedFilePath(undefined);
        }
      } else if (view === 'diff') {
        // Keep existing diff when in dedicated diff view
        // (diff is already loaded from other actions)
      } else {
        setDiff('');
        setSelectedFilePath(undefined);
      }
    } catch (error) {
      notify(`Error loading diff: ${error}`);
    } finally {
      setIsLoadingDiff(false);
    }
  }, [git, status, selectedIndex, view, focusedPanel]);

  useEffect(() => {
    void loadData(true);
  }, [loadData]);

  // Update watcher callback when loadData changes
  useEffect(() => {
    watcher.setCallback(() => void loadData(true));
  }, [watcher, loadData]);

  // Start file system watcher
  useEffect(() => {
    watcher.start();
    return () => watcher.stop();
  }, [watcher]);

  // Update activity log periodically
  useEffect(() => {
    const updateActivityLog = () => {
      setCommandLog(git.getActivityLog());
    };

    // Update immediately
    updateActivityLog();

    // Update every 2 seconds to reduce overhead
    const interval = setInterval(updateActivityLog, 2000);

    return () => clearInterval(interval);
  }, [git]);

  useEffect(() => {
    if (view === 'diff' || (view === 'main' && focusedPanel === 'status')) {
      // Increase debounce to 300ms to allow for smoother navigation
      // Cancel any pending loads if navigation continues
      const timer = setTimeout(() => {
        void loadDiff();
      }, 300);

      return () => {
        clearTimeout(timer);
        // Clear loading state when navigation continues
        setIsLoadingDiff(false);
      };
    }
  }, [view, focusedPanel, selectedIndex, loadDiff]);

  const handleStage = useCallback(
    async (path: string) => {
      try {
        await git.stageFile(path);
        await loadData(true);
        notify(`Staged: ${path}`);
      } catch (error) {
        notify(`Error staging: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleStageAll = useCallback(async () => {
    try {
      const totalFiles = status.unstaged.length + status.untracked.length;
      if (totalFiles === 0) {
        notify('No files to stage');
        return;
      }
      await git.stageAll();
      await loadData(true);
      notify(`Staged all files (${totalFiles})`);
    } catch (error) {
      notify(`Error staging all: ${error}`);
    }
  }, [git, loadData, status]);

  const handleUnstage = useCallback(
    async (path: string) => {
      try {
        await git.unstageFile(path);
        await loadData(true);
        notify(`Unstaged: ${path}`);
      } catch (error) {
        notify(`Error unstaging: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleCommit = useCallback(
    async (commitMessage: string) => {
      try {
        await git.commit(commitMessage);
        await loadData(true);
        notify(`Committed: ${commitMessage}`);
        setShowCommitModal(false);
      } catch (error) {
        notify(`Error committing: ${error}`);
        setShowCommitModal(false);
      }
    },
    [git, loadData],
  );

  const handleCheckout = useCallback(
    async (branch: string) => {
      try {
        await git.checkout(branch);
        await loadData(true);
        notify(`Switched to branch: ${branch}`);
      } catch (error) {
        notify(`Error checking out: ${error}`);
      }
    },
    [git, loadData],
  );

  const handlePush = useCallback(async () => {
    try {
      // Check if current branch has an upstream
      const hasUpstream = await git.hasUpstream();

      if (!hasUpstream) {
        // Show publish branch modal
        const currentBranch = await git.getCurrentBranch();
        const defaultRemote = remotes.length > 0 ? remotes[0]!.name : 'origin';
        setPublishBranchInfo({ branch: currentBranch, remote: defaultRemote });
        setShowPublishBranchModal(true);
        return;
      }

      notify('Pushing changes...');

      await git.push();

      await loadData(true);
      notify('Push completed successfully');
    } catch (error) {
      notify(`Push failed: ${error}`);
    }
  }, [git, loadData, remotes]);

  const handlePublishBranch = useCallback(async () => {
    try {
      setShowPublishBranchModal(false);
      notify(`Publishing branch ${publishBranchInfo.branch}...`);

      await git.pushWithSetUpstream(publishBranchInfo.remote, publishBranchInfo.branch);

      await loadData(true);
      notify(`Published branch ${publishBranchInfo.branch} to ${publishBranchInfo.remote}`);
    } catch (error) {
      notify(`Failed to publish branch: ${error}`);
    }
  }, [git, loadData, publishBranchInfo]);

  const handlePull = useCallback(async () => {
    try {
      setProgressTitle('Pulling changes...');
      setProgressMessages([]);
      setProgressComplete(false);
      setProgressError(undefined);
      setShowProgressModal(true);

      await git.pull((line) => {
        setProgressMessages((prev) => [...prev, line]);
      });

      setProgressComplete(true);
      await loadData(true);
      notify('Pull completed successfully');
    } catch (error) {
      setProgressComplete(true);
      setProgressError(String(error));
      notify(`Pull failed: ${error}`);
    }
  }, [git, loadData]);

  const handleFetch = useCallback(async () => {
    try {
      notify('Fetching from remotes...');

      await git.fetch();

      await loadData(true);
      notify('Fetch completed successfully');
    } catch (error) {
      notify(`Fetch failed: ${error}`);
    }
  }, [git, loadData]);

  const handleCreateStash = useCallback(
    async (stashMessage: string) => {
      try {
        await git.createStash(stashMessage || undefined);
        await loadData(true);
        notify(stashMessage ? `Stashed: ${stashMessage}` : 'Changes stashed');
        setShowStashModal(false);
      } catch (error) {
        notify(`Error creating stash: ${error}`);
        setShowStashModal(false);
      }
    },
    [git, loadData],
  );

  const handleApplyStash = useCallback(
    async (index: number) => {
      try {
        await git.applyStash(index);
        await loadData(true);
        notify(`Applied stash@{${index}}`);
      } catch (error) {
        notify(`Error applying stash: ${error}`);
      }
    },
    [git, loadData],
  );

  const handlePopStash = useCallback(
    async (index: number) => {
      try {
        await git.popStash(index);
        await loadData(true);
        notify(`Popped stash@{${index}}`);
      } catch (error) {
        notify(`Error popping stash: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleDropStash = useCallback(
    async (index: number) => {
      try {
        await git.dropStash(index);
        await loadData(true);
        notify(`Dropped stash@{${index}}`);
      } catch (error) {
        notify(`Error dropping stash: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleDropStashWithConfirm = useCallback(
    (index: number, stashName: string, message: string) => {
      setConfirmModalProps({
        title: 'Drop Stash?',
        message: `Are you sure you want to drop ${stashName}: ${message}? This cannot be undone.`,
        onConfirm: () => {
          setShowConfirmModal(false);
          void handleDropStash(index);
        },
        danger: true,
      });
      setShowConfirmModal(true);
    },
    [handleDropStash],
  );

  const handleViewStashDiff = useCallback(
    async (index: number) => {
      try {
        const stashDiff = await git.getStashDiff(index);
        setDiff(stashDiff);
        setView('diff');
        notify(`Viewing diff for stash@{${index}}`);
      } catch (error) {
        notify(`Error loading stash diff: ${error}`);
      }
    },
    [git],
  );

  const handleUnstageAll = useCallback(async () => {
    try {
      if (status.staged.length === 0) {
        notify('No staged files to unstage');
        return;
      }
      await git.unstageAll();
      await loadData(true);
      notify(`Unstaged all files (${status.staged.length})`);
    } catch (error) {
      notify(`Error unstaging all: ${error}`);
    }
  }, [git, loadData, status]);

  const handleDiscardChanges = useCallback(
    async (path: string) => {
      try {
        await git.discardChanges(path);
        await loadData(true);
        notify(`Discarded changes: ${path}`);
      } catch (error) {
        notify(`Error discarding changes: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleDeleteUntracked = useCallback(
    async (path: string) => {
      try {
        await git.deleteUntrackedFile(path);
        await loadData(true);
        notify(`Deleted untracked file: ${path}`);
      } catch (error) {
        notify(`Error deleting file: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleRenameFile = useCallback(
    async (oldPath: string, newPath: string) => {
      try {
        await git.renameFile(oldPath, newPath);
        await loadData(true);
        notify(`Renamed: ${oldPath} → ${newPath}`);
        setShowRenameModal(false);
      } catch (error) {
        notify(`Error renaming file: ${error}`);
        setShowRenameModal(false);
      }
    },
    [git, loadData],
  );

  const handleDiscardWithConfirm = useCallback(
    (path: string) => {
      setConfirmModalProps({
        title: 'Discard Changes?',
        message: `Are you sure you want to discard all changes to "${path}"?`,
        onConfirm: () => {
          setShowConfirmModal(false);
          void handleDiscardChanges(path);
        },
        danger: true,
      });
      setShowConfirmModal(true);
    },
    [handleDiscardChanges],
  );

  const handleDeleteWithConfirm = useCallback(
    (path: string) => {
      setConfirmModalProps({
        title: 'Delete Untracked File?',
        message: `Are you sure you want to delete "${path}"?`,
        onConfirm: () => {
          setShowConfirmModal(false);
          void handleDeleteUntracked(path);
        },
        danger: true,
      });
      setShowConfirmModal(true);
    },
    [handleDeleteUntracked],
  );

  const handleUnstageAllWithConfirm = useCallback(() => {
    if (status.staged.length === 0) {
      notify('No staged files to unstage');
      return;
    }
    setConfirmModalProps({
      title: 'Unstage All Files?',
      message: `Are you sure you want to unstage all ${status.staged.length} staged files?`,
      onConfirm: () => {
        setShowConfirmModal(false);
        void handleUnstageAll();
      },
      danger: false,
    });
    setShowConfirmModal(true);
  }, [handleUnstageAll, status]);

  const handleRenameWithModal = useCallback((path: string) => {
    setRenameFilePath(path);
    setShowRenameModal(true);
  }, []);

  const handleCreateBranch = useCallback(
    async (name: string, startPoint?: string) => {
      try {
        await git.createBranch(name, startPoint);
        await loadData(true);
        notify(`Created branch: ${name}`);
        setShowBranchModal(false);
      } catch (error) {
        notify(`Error creating branch: ${error}`);
        setShowBranchModal(false);
      }
    },
    [git, loadData],
  );

  const handleDeleteBranch = useCallback(
    (branch: string) => {
      setConfirmModalProps({
        title: 'Delete Branch?',
        message: `Are you sure you want to delete branch "${branch}"? This cannot be undone if the branch is not merged.`,
        onConfirm: async () => {
          setShowConfirmModal(false);
          try {
            await git.deleteBranch(branch, false);
            await loadData(true);
            notify(`Deleted branch: ${branch}`);
          } catch (error) {
            // Try to get merge status to provide better error message
            const errorMsg = String(error);
            if (errorMsg.includes('not fully merged')) {
              setConfirmModalProps({
                title: 'Force Delete Branch?',
                message: `Branch "${branch}" is not fully merged. Force delete anyway? This will permanently lose commits.`,
                onConfirm: async () => {
                  setShowConfirmModal(false);
                  try {
                    await git.deleteBranch(branch, true);
                    await loadData(true);
                    notify(`Force deleted branch: ${branch}`);
                  } catch (err) {
                    notify(`Error force deleting branch: ${err}`);
                  }
                },
                danger: true,
              });
              setShowConfirmModal(true);
            } else {
              notify(`Error deleting branch: ${error}`);
            }
          }
        },
        danger: true,
      });
      setShowConfirmModal(true);
    },
    [git, loadData],
  );

  const handleDeleteRemoteBranch = useCallback(
    (remoteBranch: string) => {
      // Parse remote and branch name from "remotes/origin/branch-name"
      const parts = remoteBranch.replace('remotes/', '').split('/');
      const remote = parts[0];
      const branch = parts.slice(1).join('/');

      if (!remote || !branch) {
        notify('Invalid remote branch format');
        return;
      }

      setConfirmModalProps({
        title: 'Delete Remote Branch?',
        message: `Are you sure you want to delete remote branch "${branch}" on "${remote}"? This will affect all users.`,
        onConfirm: async () => {
          setShowConfirmModal(false);
          try {
            await git.deleteRemoteBranch(remote, branch);
            await loadData(true);
            notify(`Deleted remote branch: ${remote}/${branch}`);
          } catch (error) {
            notify(`Error deleting remote branch: ${error}`);
          }
        },
        danger: true,
      });
      setShowConfirmModal(true);
    },
    [git, loadData],
  );

  const handleRenameBranch = useCallback(
    async (oldName: string, newName: string) => {
      try {
        await git.renameBranch(oldName, newName);
        await loadData(true);
        notify(`Renamed branch: ${oldName} → ${newName}`);
        setShowBranchRenameModal(false);
      } catch (error) {
        notify(`Error renaming branch: ${error}`);
        setShowBranchRenameModal(false);
      }
    },
    [git, loadData],
  );

  const handleSetUpstream = useCallback(
    async (branch: string, upstream: string) => {
      try {
        await git.setUpstream(branch, upstream);
        await loadData(true);
        notify(`Set upstream for ${branch}: ${upstream}`);
        setShowSetUpstreamModal(false);
      } catch (error) {
        notify(`Error setting upstream: ${error}`);
        setShowSetUpstreamModal(false);
      }
    },
    [git, loadData],
  );

  const handleUnsetUpstream = useCallback(
    async (branch: string) => {
      try {
        await git.unsetUpstream(branch);
        await loadData(true);
        notify(`Unset upstream for ${branch}`);
      } catch (error) {
        notify(`Error unsetting upstream: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleMerge = useCallback(
    async (branch: string, strategy: MergeStrategy) => {
      try {
        setShowMergeModal(false);
        notify(`Merging ${branch}...`);
        await git.merge(branch, strategy);
        await loadData(true);

        // Check if there are conflicts
        const newMergeState = await git.getMergeState();
        if (newMergeState.inProgress && newMergeState.conflicts.length > 0) {
          setMergeState(newMergeState);
          setShowConflictModal(true);
          notify(`Merge conflicts detected (${newMergeState.conflicts.length} files)`);
        } else {
          notify(`Successfully merged ${branch}`);
        }
      } catch (error) {
        notify(`Merge failed: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleAbortMerge = useCallback(async () => {
    try {
      await git.abortMerge();
      await loadData(true);
      setShowConflictModal(false);
      notify('Merge aborted');
    } catch (error) {
      notify(`Error aborting merge: ${error}`);
    }
  }, [git, loadData]);

  const handleResolveConflict = useCallback(
    async (path: string, resolution: 'ours' | 'theirs' | 'manual') => {
      try {
        await git.resolveConflict(path, resolution);
        await loadData(true);
        notify(`Resolved ${path} using ${resolution}`);
      } catch (error) {
        notify(`Error resolving conflict: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleEditConflict = useCallback(
    async (path: string, content: string) => {
      try {
        await git.writeConflictedFileContent(path, content);
        notify(`Edited ${path}`);
      } catch (error) {
        notify(`Error editing conflict: ${error}`);
      }
    },
    [git],
  );

  const handleStageResolved = useCallback(
    async (path: string) => {
      try {
        await git.stageFile(path);
        await loadData(true);
        notify(`Staged resolved file: ${path}`);
      } catch (error) {
        notify(`Error staging file: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleContinueMerge = useCallback(
    async (commitMessage: string) => {
      try {
        await git.continueMerge(commitMessage);
        await loadData(true);
        setShowConflictModal(false);
        notify('Merge completed successfully');
      } catch (error) {
        notify(`Error completing merge: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleCherryPick = useCallback(
    async (commitHash: string) => {
      try {
        await git.cherryPick(commitHash);
        await loadData(true);
        notify(`Cherry-picked commit ${commitHash}`);
      } catch (error) {
        notify(`Error cherry-picking: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleRevert = useCallback(
    async (commitHash: string) => {
      try {
        await git.revertCommit(commitHash);
        await loadData(true);
        notify(`Reverted commit ${commitHash}`);
      } catch (error) {
        notify(`Error reverting: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleAmend = useCallback(
    async (commitMessage: string) => {
      try {
        await git.amendCommit(commitMessage);
        await loadData(true);
        notify('Amended last commit');
      } catch (error) {
        notify(`Error amending commit: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleReset = useCallback(
    async (commitHash: string, mode: 'soft' | 'mixed' | 'hard') => {
      try {
        await git.resetToCommit(commitHash, mode);
        await loadData(true);
        setShowResetModal(false);
        notify(`Reset to ${commitHash} (${mode})`);
      } catch (error) {
        notify(`Error resetting: ${error}`);
        setShowResetModal(false);
      }
    },
    [git, loadData],
  );

  const handleViewCommitDiff = useCallback(
    async (commitHash: string) => {
      try {
        const commitDiff = await git.getCommitDiff(commitHash);
        setDiff(commitDiff);
        setView('diff');
        notify(`Viewing commit ${commitHash}`);
      } catch (error) {
        notify(`Error loading commit diff: ${error}`);
      }
    },
    [git],
  );

  const handleCopyCommitHash = useCallback(
    async (commitHash: string) => {
      try {
        await git.copyToClipboard(commitHash);
        notify(`Copied ${commitHash} to clipboard`);
      } catch (error) {
        notify(`Error copying to clipboard: ${error}`);
      }
    },
    [git],
  );

  const handleCreateTag = useCallback(
    async (commitHash: string, tagName: string, message?: string) => {
      try {
        await git.createTag(tagName, commitHash, message);
        await loadData(true);
        setShowTagModal(false);
        notify(`Created tag ${tagName} at ${commitHash}`);
      } catch (error) {
        notify(`Error creating tag: ${error}`);
        setShowTagModal(false);
      }
    },
    [git, loadData],
  );

  const handleAddRemote = useCallback(
    async (name: string, fetchUrl: string, pushUrl?: string) => {
      try {
        await git.addRemote(name, fetchUrl);
        if (pushUrl && pushUrl !== fetchUrl) {
          await git.setRemoteUrl(name, fetchUrl, pushUrl);
        }
        await loadData(true);
        setShowRemoteModal(false);
        notify(`Added remote: ${name}`);
      } catch (error) {
        notify(`Error adding remote: ${error}`);
        setShowRemoteModal(false);
      }
    },
    [git, loadData],
  );

  const handleEditRemote = useCallback(
    async (name: string, fetchUrl: string, pushUrl?: string) => {
      try {
        await git.setRemoteUrl(name, fetchUrl, pushUrl);
        await loadData(true);
        setShowRemoteModal(false);
        notify(`Updated remote: ${name}`);
      } catch (error) {
        notify(`Error updating remote: ${error}`);
        setShowRemoteModal(false);
      }
    },
    [git, loadData],
  );

  const handleRemoveRemote = useCallback(
    async (name: string) => {
      try {
        await git.removeRemote(name);
        await loadData(true);
        notify(`Removed remote: ${name}`);
      } catch (error) {
        notify(`Error removing remote: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleRemoveRemoteWithConfirm = useCallback(
    (name: string) => {
      setConfirmModalProps({
        title: 'Remove Remote?',
        message: `Are you sure you want to remove remote "${name}"?`,
        onConfirm: () => {
          setShowConfirmModal(false);
          void handleRemoveRemote(name);
        },
        danger: true,
      });
      setShowConfirmModal(true);
    },
    [handleRemoveRemote],
  );

  const handleFetchRemote = useCallback(
    async (name: string) => {
      try {
        notify(`Fetching from ${name}...`);
        await git.fetch();
        await loadData(true);
        notify(`Fetch from ${name} completed`);
      } catch (error) {
        notify(`Error fetching from ${name}: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleDeleteTag = useCallback(
    async (tagName: string) => {
      try {
        await git.deleteTag(tagName);
        await loadData(true);
        notify(`Deleted tag: ${tagName}`);
      } catch (error) {
        notify(`Error deleting tag: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleDeleteTagWithConfirm = useCallback(
    (tagName: string) => {
      setConfirmModalProps({
        title: 'Delete Tag?',
        message: `Are you sure you want to delete tag "${tagName}"?`,
        onConfirm: () => {
          setShowConfirmModal(false);
          void handleDeleteTag(tagName);
        },
        danger: true,
      });
      setShowConfirmModal(true);
    },
    [handleDeleteTag],
  );

  const handlePushTag = useCallback(
    async (tagName: string, remote: string = 'origin') => {
      try {
        notify(`Pushing tag ${tagName} to ${remote}...`);
        await git.pushTag(tagName, remote);
        await loadData(true);
        notify(`Pushed tag ${tagName} to ${remote}`);
      } catch (error) {
        notify(`Error pushing tag: ${error}`);
      }
    },
    [git, loadData],
  );

  const handlePushAllTags = useCallback(
    async (remote: string = 'origin') => {
      try {
        notify(`Pushing all tags to ${remote}...`);
        await git.pushAllTags(remote);
        await loadData(true);
        notify(`Pushed all tags to ${remote}`);
      } catch (error) {
        notify(`Error pushing tags: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleCheckoutTag = useCallback(
    async (tagName: string) => {
      try {
        await git.checkoutTag(tagName);
        await loadData(true);
        notify(`Checked out tag: ${tagName}`);
      } catch (error) {
        notify(`Error checking out tag: ${error}`);
      }
    },
    [git, loadData],
  );

  const handleDeleteRemoteTag = useCallback(
    (tagName: string, remote: string) => {
      setConfirmModalProps({
        title: 'Delete Remote Tag?',
        message: `Are you sure you want to delete tag "${tagName}" from remote "${remote}"? This will affect all users.`,
        onConfirm: async () => {
          setShowConfirmModal(false);
          try {
            await git.deleteRemoteTag(remote, tagName);
            await loadData(true);
            notify(`Deleted remote tag: ${tagName} from ${remote}`);
          } catch (error) {
            notify(`Error deleting remote tag: ${error}`);
          }
        },
        danger: true,
      });
      setShowConfirmModal(true);
    },
    [git, loadData],
  );

  const getMaxIndex = useCallback(() => {
    switch (view) {
      case 'main':
        if (focusedPanel === 'status') {
          return status.staged.length + status.unstaged.length + status.untracked.length - 1;
        } else if (focusedPanel === 'branches') {
          return branches.filter((b) => !b.remote).length - 1;
        } else if (focusedPanel === 'stashes') {
          return stashes.length - 1; // All stashes are now scrollable
        } else if (focusedPanel === 'remotes') {
          return remotes.length - 1;
        } else if (focusedPanel === 'tags') {
          return tags.length - 1; // All tags are now scrollable
        } else if (focusedPanel === 'diff') {
          return 0; // Diff panel is not selectable (uses scrolling)
        } else {
          return Math.min(commits.length - 1, 9); // log panel shows max 10 commits
        }
      case 'log':
        return commits.length - 1;
      case 'stash':
        return stashes.length - 1;
      case 'remotes':
        return remotes.length - 1;
      case 'repos':
        return (
          repos.filter(
            (r) =>
              !repoFilterQuery ||
              r.name.toLowerCase().includes(repoFilterQuery.toLowerCase()) ||
              r.path.toLowerCase().includes(repoFilterQuery.toLowerCase()),
          ).length - 1
        );
      default:
        return 0;
    }
  }, [
    view,
    focusedPanel,
    status,
    commits,
    branches,
    stashes,
    remotes,
    tags,
    repos,
    repoFilterQuery,
  ]);

  // Define available commands
  const commands: Command[] = [
    {
      id: 'edit-config',
      label: 'Edit Config',
      description: 'Configure git global user name and email',
      execute: () => setShowConfigModal(true),
    },
    {
      id: 'open-themes',
      label: 'Open Themes',
      description: 'Choose and apply a color theme',
      execute: () => setShowThemesModal(true),
    },
    {
      id: 'toggle-command-log',
      label: 'Toggle Activity Log',
      description: 'Show/hide activity log (git commands, errors, warnings)',
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
      execute: () => void handleUnstageAll(),
    },
    {
      id: 'view-main',
      label: 'View: Main',
      description: 'Show status and branches side by side',
      shortcut: '1',
      execute: () => {
        setView('main');
        setSelectedIndex(0);
      },
    },
    {
      id: 'view-log',
      label: 'View: History',
      description: 'Show commit history (full screen)',
      shortcut: '2',
      execute: () => {
        setView('log');
        setSelectedIndex(0);
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
        setView('stash');
        setSelectedIndex(0);
      },
    },
    {
      id: 'view-remotes',
      label: 'View: Remotes',
      description: 'Show remotes list',
      shortcut: '5',
      execute: () => {
        setView('remotes');
        setSelectedIndex(0);
      },
    },
    {
      id: 'view-repos',
      label: 'View: Repos',
      description: 'Show repository history and switch repos',
      shortcut: '6',
      execute: () => {
        setView('repos');
        setSelectedIndex(0);
        setRepoFilterQuery('');
        setRepoFocusedPanel('repos');
      },
    },
    {
      id: 'panel-tab-prev',
      label: 'Previous Tab',
      description: 'Navigate to previous tab in focused panel',
      shortcut: '[',
      execute: () => {
        if (
          view === 'main' &&
          (focusedPanel === 'branches' || focusedPanel === 'remotes' || focusedPanel === 'tags')
        ) {
          // Navigate to previous tab
          if (branchRemoteTab === 'branches') {
            setBranchRemoteTab('tags');
            setFocusedPanel('tags');
          } else if (branchRemoteTab === 'remotes') {
            setBranchRemoteTab('branches');
            setFocusedPanel('branches');
          } else if (branchRemoteTab === 'tags') {
            setBranchRemoteTab('remotes');
            setFocusedPanel('remotes');
          }
          setSelectedIndex(0);
        }
      },
    },
    {
      id: 'panel-tab-next',
      label: 'Next Tab',
      description: 'Navigate to next tab in focused panel',
      shortcut: ']',
      execute: () => {
        if (
          view === 'main' &&
          (focusedPanel === 'branches' || focusedPanel === 'remotes' || focusedPanel === 'tags')
        ) {
          // Navigate to next tab
          if (branchRemoteTab === 'branches') {
            setBranchRemoteTab('remotes');
            setFocusedPanel('remotes');
          } else if (branchRemoteTab === 'remotes') {
            setBranchRemoteTab('tags');
            setFocusedPanel('tags');
          } else if (branchRemoteTab === 'tags') {
            setBranchRemoteTab('branches');
            setFocusedPanel('branches');
          }
          setSelectedIndex(0);
        }
      },
    },
    {
      id: 'cycle-panels',
      label: 'Cycle Through Panels',
      description: 'Navigate to next panel with Tab key',
      shortcut: 'TAB / Shift+TAB',
      execute: () => {
        if (view === 'main') {
          const panels: Array<
            'status' | 'branches' | 'log' | 'stashes' | 'remotes' | 'tags' | 'diff'
          > =
            stashes.length > 0
              ? ['status', 'branches', 'stashes', 'log', 'diff']
              : ['status', 'branches', 'log', 'diff'];

          const currentIndex = panels.indexOf(focusedPanel);
          const nextIndex = (currentIndex + 1) % panels.length;
          setFocusedPanel(panels[nextIndex]!);
          setSelectedIndex(0);
        }
      },
    },
    {
      id: 'panel-working-dir',
      label: 'Panel: Working Directory',
      description: 'Focus working directory panel',
      shortcut: 'w',
      execute: () => {
        setView('main');
        setFocusedPanel('status');
        setSelectedIndex(0);
      },
    },
    {
      id: 'panel-branches',
      label: 'Panel: Branches',
      description: 'Focus branches panel',
      shortcut: 'b',
      execute: () => {
        setView('main');
        setBranchRemoteTab('branches');
        setFocusedPanel('branches');
        setSelectedIndex(0);
      },
    },
    {
      id: 'panel-log',
      label: 'Panel: Commits',
      description: 'Focus commits panel',
      shortcut: 'l',
      execute: () => {
        setView('main');
        setFocusedPanel('log');
        setSelectedIndex(0);
      },
    },
    {
      id: 'panel-stashes',
      label: 'Panel: Stashes',
      description: 'Focus stashes panel',
      shortcut: 'h',
      execute: () => {
        setView('main');
        setFocusedPanel('stashes');
        setSelectedIndex(0);
      },
    },
    {
      id: 'panel-diff',
      label: 'Panel: Diff',
      description: 'Focus diff panel',
      shortcut: 'v',
      execute: () => {
        setView('main');
        setFocusedPanel('diff');
        setSelectedIndex(0);
      },
    },
    {
      id: 'panel-remotes',
      label: 'Panel: Remotes',
      description: 'Focus remotes panel (removed shortcut)',
      execute: () => {
        setView('main');
        setFocusedPanel('remotes');
        setSelectedIndex(0);
      },
    },
    {
      id: 'commit',
      label: 'Commit Changes',
      description: 'Create a new commit with staged files',
      shortcut: 'c',
      execute: () => {
        if (status.staged.length > 0) {
          setShowCommitModal(true);
        } else {
          notify('No staged files to commit');
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
      description: 'Discard changes to selected unstaged file or delete untracked file',
      shortcut: 'd',
      execute: () => {
        if (view === 'main' && focusedPanel === 'status') {
          const allFiles = [...status.staged, ...status.unstaged, ...status.untracked];
          const file = allFiles[selectedIndex];
          if (file) {
            // Check if the file is untracked - if so, delete it
            const untrackedIndex = selectedIndex - status.staged.length - status.unstaged.length;
            if (untrackedIndex >= 0 && status.untracked[untrackedIndex]) {
              handleDeleteWithConfirm(file.path);
            } else {
              handleDiscardWithConfirm(file.path);
            }
          } else {
            notify('No file selected');
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
          const untrackedIndex = selectedIndex - status.staged.length - status.unstaged.length;
          const file = status.untracked[untrackedIndex];
          if (file && untrackedIndex >= 0) {
            handleDeleteWithConfirm(file.path);
          } else {
            notify('No untracked file selected');
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
          const allFiles = [...status.staged, ...status.unstaged, ...status.untracked];
          const file = allFiles[selectedIndex];
          if (file) {
            handleRenameWithModal(file.path);
          } else {
            notify('No file selected');
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
          const localBranches = branches.filter((b) => !b.remote);
          const branch = localBranches[selectedIndex];
          if (branch && !branch.current) {
            handleDeleteBranch(branch.name);
          } else if (branch?.current) {
            notify('Cannot delete current branch');
          } else {
            notify('No branch selected');
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
          const localBranches = branches.filter((b) => !b.remote);
          const branch = localBranches[selectedIndex];
          if (branch) {
            setBranchToRename(branch.name);
            setShowBranchRenameModal(true);
          } else {
            notify('No branch selected');
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
          const localBranches = branches.filter((b) => !b.remote);
          const branch = localBranches[selectedIndex];
          if (branch) {
            setBranchForUpstream(branch.name);
            setShowSetUpstreamModal(true);
          } else {
            notify('No branch selected');
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
          const localBranches = branches.filter((b) => !b.remote);
          const branch = localBranches[selectedIndex];
          if (branch && branch.upstream) {
            void handleUnsetUpstream(branch.name);
          } else if (branch && !branch.upstream) {
            notify('Branch has no upstream set');
          } else {
            notify('No branch selected');
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
          notify('Merge already in progress - resolve conflicts first');
        } else {
          setShowMergeModal(true);
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
          setShowConflictModal(true);
        } else {
          notify('No merge in progress');
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
            message:
              'Are you sure you want to abort the current merge? All conflict resolutions will be lost.',
            onConfirm: () => {
              setShowConfirmModal(false);
              void handleAbortMerge();
            },
            danger: true,
          });
          setShowConfirmModal(true);
        } else {
          notify('No merge in progress');
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
          const commit = commits[selectedIndex];
          if (commit) {
            setConfirmModalProps({
              title: 'Cherry-pick Commit?',
              message: `Apply changes from commit ${commit.shortHash}: ${commit.message}`,
              onConfirm: () => {
                setShowConfirmModal(false);
                void handleCherryPick(commit.hash);
              },
              danger: false,
            });
            setShowConfirmModal(true);
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
          const commit = commits[selectedIndex];
          if (commit) {
            setConfirmModalProps({
              title: 'Revert Commit?',
              message: `Create a new commit that undoes ${commit.shortHash}: ${commit.message}`,
              onConfirm: () => {
                setShowConfirmModal(false);
                void handleRevert(commit.hash);
              },
              danger: false,
            });
            setShowConfirmModal(true);
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
              setShowConfirmModal(false);
              const lastCommit = commits[0];
              if (lastCommit) {
                void handleAmend(lastCommit.message);
              }
            },
            danger: true,
          });
          setShowConfirmModal(true);
        } else {
          notify('No staged changes to amend');
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
          const commit = commits[selectedIndex];
          if (commit) {
            setSelectedCommitForAction(commit);
            setShowResetModal(true);
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
          const commit = commits[selectedIndex];
          if (commit) {
            void handleViewCommitDiff(commit.hash);
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
          const commit = commits[selectedIndex];
          if (commit) {
            void handleCopyCommitHash(commit.hash);
          }
        }
      },
    },
    {
      id: 'create-tag-commit',
      label: 'Create Tag',
      description: 'Create a tag at selected commit',
      shortcut: 't (in log view)',
      execute: () => {
        if (view === 'log' || (view === 'main' && focusedPanel === 'log')) {
          const commit = commits[selectedIndex];
          if (commit) {
            setSelectedCommitForAction(commit);
            setShowTagModal(true);
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
        setRemoteModalMode('add');
        setRemoteToEdit(undefined);
        setShowRemoteModal(true);
      },
    },
    {
      id: 'edit-remote',
      label: 'Edit Remote',
      description: 'Edit selected remote URL',
      shortcut: 'e (in remotes panel)',
      execute: () => {
        if ((view === 'main' && focusedPanel === 'remotes') || view === 'remotes') {
          const remote = remotes[selectedIndex];
          if (remote) {
            setRemoteModalMode('edit');
            setRemoteToEdit(remote);
            setShowRemoteModal(true);
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
          const remote = remotes[selectedIndex];
          if (remote) {
            handleRemoveRemoteWithConfirm(remote.name);
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
          const version = await git.getVersion();
          notify(version);
        } catch (error) {
          notify(`Error getting git version: ${error}`);
        }
      },
    },
    {
      id: 'create-tag-head',
      label: 'Create Tag',
      description: 'Create a new tag at selected commit or HEAD',
      shortcut: 'n / t (in tags panel)',
      execute: () => setShowTagModal(true),
    },
    {
      id: 'delete-tag',
      label: 'Delete Tag',
      description: 'Delete selected local tag',
      shortcut: 'D (in tags panel)',
      execute: () => {
        if (view === 'main' && focusedPanel === 'tags') {
          const tag = tags[selectedIndex];
          if (tag) {
            handleDeleteTagWithConfirm(tag.name);
          } else {
            notify('No tag selected');
          }
        }
      },
    },
    {
      id: 'push-tag',
      label: 'Push Tag',
      description: 'Push selected tag to remote',
      shortcut: 'P (in tags panel)',
      execute: () => {
        if (view === 'main' && focusedPanel === 'tags') {
          const tag = tags[selectedIndex];
          if (tag) {
            void handlePushTag(tag.name);
          } else {
            notify('No tag selected');
          }
        }
      },
    },
    {
      id: 'push-all-tags',
      label: 'Push All Tags',
      description: 'Push all local tags to remote',
      execute: () => void handlePushAllTags(),
    },
    {
      id: 'delete-remote-tag',
      label: 'Delete Remote Tag',
      description: 'Delete a tag from remote repository',
      execute: () => {
        if (view === 'main' && focusedPanel === 'tags') {
          const tag = tags[selectedIndex];
          if (tag) {
            setConfirmModalProps({
              title: 'Delete Remote Tag?',
              message: `Delete tag '${tag.name}' from remote 'origin'? This cannot be undone.`,
              onConfirm: () => {
                setShowConfirmModal(false);
                void handleDeleteRemoteTag('origin', tag.name);
              },
              danger: true,
            });
            setShowConfirmModal(true);
          } else {
            notify('No tag selected');
          }
        }
      },
    },
    {
      id: 'checkout-tag',
      label: 'Checkout Tag',
      description: 'Checkout selected tag (detached HEAD)',
      shortcut: 'ENTER (in tags panel)',
      execute: () => {
        if (view === 'main' && focusedPanel === 'tags') {
          const tag = tags[selectedIndex];
          if (tag) {
            void handleCheckoutTag(tag.name);
          } else {
            notify('No tag selected');
          }
        }
      },
    },
    {
      id: 'view-tag-details',
      label: 'View Tag Details',
      description: 'Show full tag annotation and details',
      shortcut: 'i (in tags panel)',
      execute: () => {
        if (view === 'main' && focusedPanel === 'tags') {
          const tag = tags[selectedIndex];
          if (tag) {
            setView('tagDetails');
          } else {
            notify('No tag selected');
          }
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
  ];

  useKeyboard((key) => {
    if (
      showExitModal ||
      showSettingsModal ||
      showConfigModal ||
      showThemesModal ||
      showProgressModal ||
      showConfirmModal ||
      showRenameModal ||
      showBranchModal ||
      showBranchRenameModal ||
      showSetUpstreamModal ||
      showMergeModal ||
      showConflictModal ||
      showResetModal ||
      showTagModal ||
      showRemoteModal ||
      showPublishBranchModal ||
      showRepoSwitchModal ||
      showKeyboardShortcutsModal
    ) {
      // Modals handle their own keyboard input
      return;
    }

    if (showCommitModal || showStashModal) {
      if (key.name === 'escape') {
        setShowCommitModal(false);
        setShowStashModal(false);
      }
      return;
    }

    // Special handling for repos view filter panel - intercept all keys except Tab and Escape
    if (view === 'repos' && repoFocusedPanel === 'filter') {
      // Tab to switch to repos panel
      if (key.name === 'tab') {
        setRepoFocusedPanel('repos');
        setSelectedIndex(0);
        return;
      }

      // Only Escape exits (not 'q' - that's a valid filter character)
      if (key.name === 'escape') {
        setShowExitModal(true);
        return;
      }

      // Handle text input for filtering
      if (key.sequence && key.sequence.length === 1 && !key.ctrl && !key.meta) {
        const char = key.sequence;
        if (/^[a-zA-Z0-9_\-\/. ]$/.test(char)) {
          setRepoFilterQuery((prev) => prev + char);
          return;
        }
      }

      // Backspace to remove character from filter
      if (key.name === 'backspace') {
        if (repoFilterQuery.length > 0) {
          setRepoFilterQuery((prev) => prev.slice(0, -1));
        }
        return;
      }

      // Block all other shortcuts when in filter panel
      return;
    }

    // Settings modal with '/' key
    if (key.sequence === '/') {
      setShowSettingsModal(true);
      return;
    }

    // Toggle command log with '`' key (backtick)
    if (key.sequence === '`') {
      setShowCommandLog((prev) => !prev);
      return;
    }

    // Show keyboard shortcuts with Shift+? (which is just '?')
    if (key.sequence === '?') {
      setShowKeyboardShortcutsModal(true);
      return;
    }

    // Tag details view navigation
    if (view === 'tagDetails') {
      const tag = tags[selectedIndex];

      if (key.name === 'escape') {
        setView('main');
        setFocusedPanel('tags');
        return;
      }

      if (tag && key.sequence === 'D') {
        handleDeleteTagWithConfirm(tag.name);
        return;
      }

      if (tag && key.sequence === 'P') {
        void handlePushTag(tag.name);
        return;
      }

      if (tag && key.name === 'return') {
        void handleCheckoutTag(tag.name);
        return;
      }
    }

    // ESC or 'q' key should show exit modal
    if (key.name === 'escape' || key.sequence === 'q') {
      setShowExitModal(true);
      return;
    }

    // View switching
    if (key.sequence === '1') {
      setView('main');
      setSelectedIndex(0);
    } else if (key.sequence === '2') {
      setView('log');
      setSelectedIndex(0);
    } else if (key.sequence === '3') {
      setView('diff');
    } else if (key.sequence === '4') {
      setView('stash');
      setSelectedIndex(0);
    } else if (key.sequence === '5') {
      setView('remotes');
      setSelectedIndex(0);
    } else if (key.sequence === '6') {
      setView('repos');
      setSelectedIndex(0);
      setRepoFilterQuery('');
      setRepoFocusedPanel('repos');
    }

    // Panel switching (when in main view)
    if (view === 'main') {
      // [ and ] keys navigate between tabs when inside a tabbed panel
      if (focusedPanel === 'branches' || focusedPanel === 'remotes' || focusedPanel === 'tags') {
        if (key.sequence === '[') {
          // Navigate to previous tab: branches <- remotes <- tags <- branches
          if (branchRemoteTab === 'branches') {
            setBranchRemoteTab('tags');
            setFocusedPanel('tags');
          } else if (branchRemoteTab === 'remotes') {
            setBranchRemoteTab('branches');
            setFocusedPanel('branches');
          } else if (branchRemoteTab === 'tags') {
            setBranchRemoteTab('remotes');
            setFocusedPanel('remotes');
          }
          setSelectedIndex(0);
          return;
        } else if (key.sequence === ']') {
          // Navigate to next tab: branches -> remotes -> tags -> branches
          if (branchRemoteTab === 'branches') {
            setBranchRemoteTab('remotes');
            setFocusedPanel('remotes');
          } else if (branchRemoteTab === 'remotes') {
            setBranchRemoteTab('tags');
            setFocusedPanel('tags');
          } else if (branchRemoteTab === 'tags') {
            setBranchRemoteTab('branches');
            setFocusedPanel('branches');
          }
          setSelectedIndex(0);
          return;
        }
      }

      // Panel shortcuts
      if (key.sequence === 'w') {
        setFocusedPanel('status');
        setSelectedIndex(0);
      } else if (key.sequence === 'b') {
        setBranchRemoteTab('branches');
        setFocusedPanel('branches');
        setSelectedIndex(0);
      } else if (key.sequence === 'l') {
        setFocusedPanel('log');
        setSelectedIndex(0);
      } else if (key.sequence === 'h') {
        setFocusedPanel('stashes');
        setSelectedIndex(0);
      } else if (key.sequence === 'v') {
        setFocusedPanel('diff');
        setSelectedIndex(0);
      }

      // Tab key to cycle through panels (forward with Tab, backward with Shift+Tab)
      if (key.name === 'tab') {
        const panels: Array<
          'status' | 'branches' | 'log' | 'stashes' | 'remotes' | 'tags' | 'diff'
        > =
          stashes.length > 0
            ? ['status', 'branches', 'stashes', 'log', 'diff']
            : ['status', 'branches', 'log', 'diff'];

        const currentIndex = panels.indexOf(focusedPanel);

        // Shift+Tab goes backward, Tab goes forward
        const nextIndex = key.shift
          ? (currentIndex - 1 + panels.length) % panels.length
          : (currentIndex + 1) % panels.length;

        setFocusedPanel(panels[nextIndex]!);
        setSelectedIndex(0);
      }

      // Switch between Branches/Remotes/Tags tabs with left/right arrow when panel is focused
      if (focusedPanel === 'branches' || focusedPanel === 'remotes' || focusedPanel === 'tags') {
        if (key.name === 'left') {
          // Cycle left: tags -> remotes -> branches -> tags
          if (branchRemoteTab === 'branches') {
            setBranchRemoteTab('tags');
            setFocusedPanel('tags');
          } else if (branchRemoteTab === 'remotes') {
            setBranchRemoteTab('branches');
            setFocusedPanel('branches');
          } else if (branchRemoteTab === 'tags') {
            setBranchRemoteTab('remotes');
            setFocusedPanel('remotes');
          }
          setSelectedIndex(0);
        } else if (key.name === 'right') {
          // Cycle right: branches -> remotes -> tags -> branches
          if (branchRemoteTab === 'branches') {
            setBranchRemoteTab('remotes');
            setFocusedPanel('remotes');
          } else if (branchRemoteTab === 'remotes') {
            setBranchRemoteTab('tags');
            setFocusedPanel('tags');
          } else if (branchRemoteTab === 'tags') {
            setBranchRemoteTab('branches');
            setFocusedPanel('branches');
          }
          setSelectedIndex(0);
        }
      }
    }

    // Navigation (only for views with selectable items, not diff view)
    if (view !== 'diff') {
      // In repos view, only navigate when repos panel is focused (not filter panel)
      if (view === 'repos' && repoFocusedPanel === 'filter') {
        // Don't allow up/down navigation in filter panel
      } else if (key.name === 'up') {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (key.name === 'down') {
        const max = getMaxIndex();
        setSelectedIndex((prev) => Math.min(max, prev + 1));
      }
    }

    // Actions
    if (key.name === 'return') {
      if (view === 'main' && focusedPanel === 'branches' && branchRemoteTab === 'branches') {
        const localBranches = branches.filter((b) => !b.remote);
        const branch = localBranches[selectedIndex];
        if (branch && !branch.current) {
          void handleCheckout(branch.name);
        }
      }
    }

    // Branch operations (when in branches panel and branches tab is active)
    if (view === 'main' && focusedPanel === 'branches' && branchRemoteTab === 'branches') {
      const localBranches = branches.filter((b) => !b.remote);
      const branch = localBranches[selectedIndex];

      // 'n' key to create new branch
      if (key.sequence === 'n') {
        setShowBranchModal(true);
      }

      // 'D' key to delete branch
      if (key.sequence === 'D' && branch && !branch.current) {
        handleDeleteBranch(branch.name);
      }

      // 'R' key to rename branch
      if (key.sequence === 'R' && branch) {
        setBranchToRename(branch.name);
        setShowBranchRenameModal(true);
      }

      // 'u' key to set upstream
      if (key.sequence === 'u' && branch) {
        setBranchForUpstream(branch.name);
        setShowSetUpstreamModal(true);
      }

      // 'U' key to unset upstream
      if (key.sequence === 'U' && branch && branch.upstream) {
        void handleUnsetUpstream(branch.name);
      }
    }

    // Stash operations (when in stashes panel)
    if (view === 'main' && focusedPanel === 'stashes') {
      const stash = stashes[selectedIndex];

      if (stash && key.name === 'return') {
        // Apply stash on Enter
        void handleApplyStash(stash.index);
      } else if (stash && key.sequence === 'P') {
        // Pop stash on Shift+P
        void handlePopStash(stash.index);
      } else if (stash && key.sequence === 'D') {
        // Drop stash on Shift+D
        handleDropStashWithConfirm(stash.index, stash.name, stash.message);
      } else if (stash && key.sequence === 'V') {
        // View stash diff on Shift+V
        void handleViewStashDiff(stash.index);
      }
    }

    // Spacebar to stage/unstage file in status panel
    if (key.name === 'space') {
      if (view === 'main' && focusedPanel === 'status') {
        const allFiles = [...status.staged, ...status.unstaged, ...status.untracked];
        const file = allFiles[selectedIndex];
        if (file) {
          if (file.staged) {
            void handleUnstage(file.path);
          } else {
            void handleStage(file.path);
          }
        }
      }
    }

    // 'd' key to discard changes to unstaged files or delete untracked files
    if (key.sequence === 'd') {
      if (view === 'main' && focusedPanel === 'status') {
        const allFiles = [...status.staged, ...status.unstaged, ...status.untracked];
        const file = allFiles[selectedIndex];
        if (file && !file.staged) {
          // Check if the file is untracked - if so, delete it
          const untrackedIndex = selectedIndex - status.staged.length - status.unstaged.length;
          if (untrackedIndex >= 0 && status.untracked[untrackedIndex]) {
            handleDeleteWithConfirm(file.path);
          } else {
            handleDiscardWithConfirm(file.path);
          }
        } else if (file?.staged) {
          notify('Cannot discard staged file (unstage it first)');
        } else {
          notify('No file selected');
        }
      }
    }

    // 'D' key (shift+d) to delete untracked files
    if (key.sequence === 'D') {
      if (view === 'main' && focusedPanel === 'status') {
        const untrackedIndex = selectedIndex - status.staged.length - status.unstaged.length;
        const file = status.untracked[untrackedIndex];
        if (file && untrackedIndex >= 0) {
          handleDeleteWithConfirm(file.path);
        }
      }
    }

    // 'r' key to rename/move file
    if (key.sequence === 'r') {
      if (view === 'main' && focusedPanel === 'status') {
        const allFiles = [...status.staged, ...status.unstaged, ...status.untracked];
        const file = allFiles[selectedIndex];
        if (file) {
          handleRenameWithModal(file.path);
        }
      }
    }

    // 'A' key (shift+a) to unstage all
    if (key.sequence === 'A') {
      void handleUnstageAll();
    }

    // 's' key to create stash
    if (key.sequence === 's') {
      setShowStashModal(true);
    }

    if (key.sequence === 'a') {
      void handleStageAll();
    }

    if (key.sequence === 'c') {
      if (status.staged.length > 0) {
        setShowCommitModal(true);
      } else {
        notify('No staged files to commit');
      }
    }

    if (key.sequence === 'P') {
      void handlePush();
    }

    if (key.sequence === 'p') {
      void handlePull();
    }

    if (key.sequence === 'f') {
      void handleFetch();
    }

    // Merge operations
    if (key.sequence === 'm') {
      if (mergeState.inProgress) {
        notify('Merge already in progress - resolve conflicts first');
      } else {
        setShowMergeModal(true);
      }
    }

    if (key.sequence === 'C') {
      if (mergeState.inProgress) {
        setShowConflictModal(true);
      } else {
        notify('No merge in progress');
      }
    }

    // Stash operations
    if (key.sequence === 'S') {
      setShowStashModal(true);
    }

    // Stash view actions
    if (view === 'stash' && stashes.length > 0) {
      const stash = stashes[selectedIndex];

      if (stash && key.name === 'return') {
        // Apply stash on Enter
        void handleApplyStash(stash.index);
      } else if (stash && key.sequence === 'P') {
        // Pop stash on Shift+P
        void handlePopStash(stash.index);
      } else if (stash && key.sequence === 'D') {
        // Drop stash on Shift+D
        handleDropStashWithConfirm(stash.index, stash.name, stash.message);
      } else if (stash && key.sequence === 'V') {
        // View stash diff on Shift+V
        void handleViewStashDiff(stash.index);
      }
    }

    // Tag operations (when in tags panel or tags tab)
    if (
      (view === 'main' && focusedPanel === 'tags') ||
      (view === 'main' && branchRemoteTab === 'tags')
    ) {
      const tag = tags[selectedIndex];

      // Enter key to checkout tag
      if (tag && key.name === 'return') {
        void handleCheckoutTag(tag.name);
      }

      // 'i' key to view tag details
      if (tag && key.sequence === 'i') {
        setView('tagDetails');
      }

      // 'n' key to create new tag
      if (key.sequence === 'n') {
        setShowTagModal(true);
      }

      // 'D' key to delete tag
      if (tag && key.sequence === 'D') {
        handleDeleteTagWithConfirm(tag.name);
      }

      // 'P' key to push tag
      if (tag && key.sequence === 'P') {
        void handlePushTag(tag.name);
      }

      // 't' key to create tag at HEAD
      if (key.sequence === 't') {
        setSelectedCommitForAction(commits[0] || null);
        setShowTagModal(true);
      }
    }

    // Remotes view and panel actions
    if (
      (view === 'remotes' || (view === 'main' && focusedPanel === 'remotes')) &&
      remotes.length > 0
    ) {
      const remote = remotes[selectedIndex];

      if (remote && key.name === 'return') {
        // Fetch from remote on Enter
        void handleFetchRemote(remote.name);
      } else if (key.sequence === 'n') {
        // Add new remote on 'n'
        setRemoteModalMode('add');
        setRemoteToEdit(undefined);
        setShowRemoteModal(true);
      } else if (remote && key.sequence === 'e') {
        // Edit remote on 'e'
        setRemoteModalMode('edit');
        setRemoteToEdit(remote);
        setShowRemoteModal(true);
      } else if (remote && key.sequence === 'D') {
        // Delete remote on Shift+D
        handleRemoveRemoteWithConfirm(remote.name);
      }
    } else if (
      (view === 'remotes' || (view === 'main' && focusedPanel === 'remotes')) &&
      remotes.length === 0
    ) {
      // Allow adding remotes even when list is empty
      if (key.sequence === 'n') {
        setRemoteModalMode('add');
        setRemoteToEdit(undefined);
        setShowRemoteModal(true);
      }
    }

    // Log view actions
    if (view === 'log' || (view === 'main' && focusedPanel === 'log')) {
      const commit = commits[selectedIndex];

      if (commit && key.name === 'return') {
        // View commit diff on Enter
        void handleViewCommitDiff(commit.hash);
      } else if (commit && key.sequence === 'y') {
        // Cherry-pick on 'y'
        setConfirmModalProps({
          title: 'Cherry-pick Commit?',
          message: `Apply changes from commit ${commit.shortHash}: ${commit.message}`,
          onConfirm: () => {
            setShowConfirmModal(false);
            void handleCherryPick(commit.hash);
          },
          danger: false,
        });
        setShowConfirmModal(true);
      } else if (commit && key.sequence === 'R') {
        // Revert on Shift+R
        setConfirmModalProps({
          title: 'Revert Commit?',
          message: `Create a new commit that undoes ${commit.shortHash}: ${commit.message}`,
          onConfirm: () => {
            setShowConfirmModal(false);
            void handleRevert(commit.hash);
          },
          danger: false,
        });
        setShowConfirmModal(true);
      } else if (commit && key.sequence === 'X') {
        // Reset on Shift+X
        setSelectedCommitForAction(commit);
        setShowResetModal(true);
      } else if (commit && key.sequence === 'Y') {
        // Copy hash on Shift+Y
        void handleCopyCommitHash(commit.hash);
      } else if (commit && key.sequence === 't') {
        // Create tag on 't'
        setSelectedCommitForAction(commit);
        setShowTagModal(true);
      }
    }

    // Repos view actions (only when repos panel is focused, filter panel is handled above)
    if (view === 'repos' && repoFocusedPanel === 'repos') {
      // Tab to switch back to filter panel
      if (key.name === 'tab') {
        setRepoFocusedPanel('filter');
        setSelectedIndex(0);
        return;
      }

      // Enter to switch to selected repo
      if (key.name === 'return') {
        const filteredRepos = repoFilterQuery
          ? repos.filter(
              (r) =>
                r.name.toLowerCase().includes(repoFilterQuery.toLowerCase()) ||
                r.path.toLowerCase().includes(repoFilterQuery.toLowerCase()),
            )
          : repos;

        const selectedRepo = filteredRepos[selectedIndex];
        if (selectedRepo) {
          handleRepoSwitch(selectedRepo.path);
        }
        return;
      }

      // 'D' to delete repo from history with confirmation
      if (key.sequence === 'D') {
        const filteredRepos = repoFilterQuery
          ? repos.filter(
              (r) =>
                r.name.toLowerCase().includes(repoFilterQuery.toLowerCase()) ||
                r.path.toLowerCase().includes(repoFilterQuery.toLowerCase()),
            )
          : repos;

        const selectedRepo = filteredRepos[selectedIndex];
        if (selectedRepo) {
          // Prevent deleting the currently active repository
          if (selectedRepo.path === currentRepoPath) {
            notify('Cannot remove the currently active repository from history');
            return;
          }

          setConfirmModalProps({
            title: 'Remove from History?',
            message: `Remove "${selectedRepo.name}" from repository history?\n\nPath: ${selectedRepo.path}\n\nThis will not delete the repository, only remove it from GitArbor's history.`,
            onConfirm: () => {
              setShowConfirmModal(false);
              // Remove from workspace recentRepositories
              const config = workspaceManager.getConfig();
              config.recentRepositories = config.recentRepositories.filter(
                (r) => r.path !== selectedRepo.path,
              );
              void workspaceManager.save().then(() => {
                setRepos(workspaceManager.getConfig().recentRepositories);
                notify(`Removed ${selectedRepo.name} from history`);
                // Adjust selected index if needed
                if (selectedIndex >= filteredRepos.length - 1) {
                  setSelectedIndex(Math.max(0, filteredRepos.length - 2));
                }
              });
            },
            danger: false,
          });
          setShowConfirmModal(true);
        }
        return;
      }
    }
  });

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
    setSelectedIndex(0);
  }, []);

  return (
    <box
      width="100%"
      height="100%"
      flexDirection="column"
      backgroundColor={theme.colors.background.primary}
    >
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
          isLoadingDiff={isLoadingDiff}
        />
      )}

      {view === 'log' && (
        <HistoryView commits={commits} selectedIndex={selectedIndex} focused={!showCommitModal} />
      )}

      {view === 'diff' && <DiffView diff={diff} focused={!showCommitModal && !showStashModal} />}

      {view === 'stash' && (
        <StashView
          stashes={stashes}
          selectedIndex={selectedIndex}
          focused={!showCommitModal && !showStashModal}
        />
      )}

      {view === 'remotes' && (
        <RemotesView remotes={remotes} selectedIndex={selectedIndex} focused={!showRemoteModal} />
      )}

      {view === 'repos' && (
        <ReposView
          repos={repos}
          selectedIndex={selectedIndex}
          focusedPanel={repoFocusedPanel}
          filterQuery={repoFilterQuery}
          onFilterChange={setRepoFilterQuery}
        />
      )}

      {view === 'tagDetails' && tags[selectedIndex] && (
        <TagDetailsView tag={tags[selectedIndex]!} />
      )}

      <Footer
        view={view}
        focusedPanel={view === 'repos' ? repoFocusedPanel : focusedPanel}
        hasStaged={status.staged.length > 0}
        hasUnstaged={status.unstaged.length > 0}
        hasUntracked={status.untracked.length > 0}
        hasStashes={stashes.length > 0}
        mergeInProgress={mergeState.inProgress}
      />

      {showCommitModal && (
        <CommitModal onCommit={handleCommit} onCancel={() => setShowCommitModal(false)} />
      )}

      {showStashModal && (
        <StashModal onStash={handleCreateStash} onCancel={() => setShowStashModal(false)} />
      )}

      {showExitModal && (
        <ExitModal onConfirm={handleExit} onCancel={() => setShowExitModal(false)} />
      )}

      {showSettingsModal && (
        <SettingsModal
          onEditConfig={() => {
            setShowSettingsModal(false);
            setShowConfigModal(true);
          }}
          onChangeTheme={() => {
            setShowSettingsModal(false);
            setShowThemesModal(true);
          }}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showConfigModal && <ConfigModal onClose={() => setShowConfigModal(false)} />}

      {showThemesModal && <ThemesModal onClose={() => setShowThemesModal(false)} />}

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

      {showTagModal && (
        <TagModal
          commitHash={selectedCommitForAction?.shortHash}
          commitMessage={selectedCommitForAction?.message}
          onCreateTag={(tagName, message) => {
            const commitHash = selectedCommitForAction?.hash || 'HEAD';
            void handleCreateTag(commitHash, tagName, message);
          }}
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

      {showPublishBranchModal && (
        <PublishBranchModal
          branch={publishBranchInfo.branch}
          remote={publishBranchInfo.remote}
          onConfirm={handlePublishBranch}
          onCancel={() => setShowPublishBranchModal(false)}
        />
      )}

      {showRepoSwitchModal && pendingRepoSwitch && (
        <RepoSwitchModal
          repoName={repos.find((r) => r.path === pendingRepoSwitch)?.name || pendingRepoSwitch}
          stagedCount={status.staged.length}
          unstagedCount={status.unstaged.length}
          untrackedCount={status.untracked.length}
          onConfirm={handleConfirmRepoSwitch}
          onCancel={() => {
            setShowRepoSwitchModal(false);
            setPendingRepoSwitch(null);
          }}
        />
      )}

      {showKeyboardShortcutsModal && (
        <KeyboardShortcutsModal onClose={() => setShowKeyboardShortcutsModal(false)} />
      )}
    </box>
  );
}
