export interface Repository {
  id: string
  path: string
  name: string
  lastAccessed: number
}

export interface WorkspaceSession {
  id: string
  name: string
  repositories: Repository[]
  activeRepositoryId: string
  createdAt: number
  lastModified: number
}

export interface WorkspaceConfig {
  sessions: WorkspaceSession[]
  activeSessionId?: string
  recentRepositories: Repository[]
}
