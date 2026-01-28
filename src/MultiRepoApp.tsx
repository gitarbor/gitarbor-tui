import { useState, useEffect, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { theme } from './theme';
import { WorkspaceManager } from './utils/workspace';
import { App } from './App';
import { RepositoryTabs } from './components/RepositoryTabs';
import { RepositorySwitcherModal } from './components/RepositorySwitcherModal';
import { WorkspaceModal } from './components/WorkspaceModal';
import { basename } from 'path';
import type { Repository, WorkspaceSession } from './types/workspace';
import type { ReactElement } from 'react';

interface RepositoryState {
  repository: Repository;
  app: ReactElement;
}

export function MultiRepoApp({ initialCwd }: { initialCwd: string }) {
  const [workspaceManager] = useState(() => new WorkspaceManager());
  const [initialized, setInitialized] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [activeRepositoryId, setActiveRepositoryId] = useState<string>('');
  const [sessions, setSessions] = useState<WorkspaceSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);
  const [showRepositorySwitcher, setShowRepositorySwitcher] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [recentRepositories, setRecentRepositories] = useState<Repository[]>([]);

  // Initialize workspace manager
  useEffect(() => {
    async function init() {
      try {
        await workspaceManager.initialize();
        const config = workspaceManager.getConfig();

        // Load active session or create initial repository
        if (config.activeSessionId) {
          const session = await workspaceManager.getSession(config.activeSessionId);
          if (session) {
            setRepositories(session.repositories);
            setActiveRepositoryId(session.activeRepositoryId);
            setActiveSessionId(session.id);
          } else {
            // Session not found, create initial repo
            await createInitialRepository();
          }
        } else {
          await createInitialRepository();
        }

        setSessions(config.sessions);
        setRecentRepositories(config.recentRepositories);
        setInitialized(true);
      } catch (error) {
        // Fallback: create initial repository
        await createInitialRepository();
        setInitialized(true);
      }
    }

    async function createInitialRepository() {
      const repo = await workspaceManager.addRepository(initialCwd);
      setRepositories([repo]);
      setActiveRepositoryId(repo.id);
    }

    void init();
  }, [workspaceManager, initialCwd]);

  const handleAddRepository = useCallback(
    async (path: string) => {
      try {
        const repo = await workspaceManager.addRepository(path);
        setRepositories((prev) => [...prev, repo]);
        setActiveRepositoryId(repo.id);

        // Update current session if active
        if (activeSessionId) {
          await workspaceManager.addRepositoryToSession(activeSessionId, repo);
          const session = await workspaceManager.getSession(activeSessionId);
          if (session) {
            setSessions((prev) => prev.map((s) => (s.id === session.id ? session : s)));
          }
        }

        const config = workspaceManager.getConfig();
        setRecentRepositories(config.recentRepositories);
      } catch (error) {
        // Handle error - could show in footer
      }
    },
    [workspaceManager, activeSessionId],
  );

  const handleSelectRepository = useCallback(
    async (repo: Repository) => {
      // Check if repository is already open
      const existing = repositories.find((r) => r.path === repo.path);
      if (existing) {
        setActiveRepositoryId(existing.id);
        if (activeSessionId) {
          await workspaceManager.setActiveRepository(activeSessionId, existing.id);
        }
      } else {
        // Add new repository
        await handleAddRepository(repo.path);
      }
    },
    [repositories, activeSessionId, workspaceManager, handleAddRepository],
  );

  const handleCloseRepository = useCallback(
    async (repositoryId: string) => {
      if (repositories.length === 1) {
        // Can't close the last repository
        return;
      }

      setRepositories((prev) => {
        const newRepos = prev.filter((r) => r.id !== repositoryId);

        // If closing active repository, switch to another one
        if (repositoryId === activeRepositoryId && newRepos.length > 0) {
          setActiveRepositoryId(newRepos[0]!.id);
        }

        return newRepos;
      });

      // Update session if active
      if (activeSessionId) {
        await workspaceManager.removeRepositoryFromSession(activeSessionId, repositoryId);
        const session = await workspaceManager.getSession(activeSessionId);
        if (session) {
          setSessions((prev) => prev.map((s) => (s.id === session.id ? session : s)));
        }
      }
    },
    [repositories, activeRepositoryId, activeSessionId, workspaceManager],
  );

  const handleSaveSession = useCallback(
    async (name: string) => {
      try {
        const session = await workspaceManager.createSession(name, repositories);
        setSessions((prev) => [...prev, session]);
        setActiveSessionId(session.id);
        await workspaceManager.setActiveSession(session.id);
        setShowWorkspaceModal(false);
      } catch (error) {
        // Handle error
      }
    },
    [workspaceManager, repositories],
  );

  const handleLoadSession = useCallback(
    async (sessionId: string) => {
      try {
        const session = await workspaceManager.getSession(sessionId);
        if (session) {
          setRepositories(session.repositories);
          setActiveRepositoryId(session.activeRepositoryId);
          setActiveSessionId(session.id);
          await workspaceManager.setActiveSession(session.id);
        }
      } catch (error) {
        // Handle error
      }
    },
    [workspaceManager],
  );

  const handleDeleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await workspaceManager.deleteSession(sessionId);
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        if (activeSessionId === sessionId) {
          setActiveSessionId(undefined);
        }
      } catch (error) {
        // Handle error
      }
    },
    [workspaceManager, activeSessionId],
  );

  // Global keyboard handlers for workspace features
  useKeyboard((key) => {
    // Don't intercept if modal is open
    if (showRepositorySwitcher || showWorkspaceModal) {
      return;
    }

    // Ctrl+T to open repository switcher
    if (key.ctrl && key.sequence === 't') {
      setShowRepositorySwitcher(true);
    }

    // Ctrl+W to open workspace modal
    if (key.ctrl && key.sequence === 'w') {
      setShowWorkspaceModal(true);
    }

    // Ctrl+Tab to cycle through repositories
    if (key.ctrl && key.name === 'tab') {
      const currentIndex = repositories.findIndex((r) => r.id === activeRepositoryId);
      const nextIndex = (currentIndex + 1) % repositories.length;
      const nextRepo = repositories[nextIndex];
      if (nextRepo) {
        setActiveRepositoryId(nextRepo.id);
      }
    }

    // Ctrl+Shift+Tab to cycle backwards through repositories
    if (key.ctrl && key.shift && key.name === 'tab') {
      const currentIndex = repositories.findIndex((r) => r.id === activeRepositoryId);
      const prevIndex = (currentIndex - 1 + repositories.length) % repositories.length;
      const prevRepo = repositories[prevIndex];
      if (prevRepo) {
        setActiveRepositoryId(prevRepo.id);
      }
    }

    // Ctrl+number to switch to specific repository
    if (key.ctrl && key.sequence && /^[1-9]$/.test(key.sequence)) {
      const index = parseInt(key.sequence, 10) - 1;
      const repo = repositories[index];
      if (repo) {
        setActiveRepositoryId(repo.id);
      }
    }
  });

  if (!initialized) {
    return (
      <box width="100%" height="100%" alignItems="center" justifyContent="center">
        <text fg={theme.colors.text.primary}>Loading workspace...</text>
      </box>
    );
  }

  const activeRepository = repositories.find((r) => r.id === activeRepositoryId);

  return (
    <box width="100%" height="100%" flexDirection="column">
      {repositories.length > 1 && (
        <RepositoryTabs
          repositories={repositories}
          activeRepositoryId={activeRepositoryId}
          onSelectRepository={setActiveRepositoryId}
          onCloseRepository={handleCloseRepository}
        />
      )}

      {activeRepository && <App key={activeRepository.id} cwd={activeRepository.path} />}

      {showRepositorySwitcher && (
        <RepositorySwitcherModal
          repositories={repositories}
          recentRepositories={recentRepositories}
          onSelectRepository={handleSelectRepository}
          onAddRepository={handleAddRepository}
          onClose={() => setShowRepositorySwitcher(false)}
        />
      )}

      {showWorkspaceModal && (
        <WorkspaceModal
          sessions={sessions}
          activeSessionId={activeSessionId}
          onLoadSession={handleLoadSession}
          onSaveSession={handleSaveSession}
          onDeleteSession={handleDeleteSession}
          onClose={() => setShowWorkspaceModal(false)}
        />
      )}
    </box>
  );
}
