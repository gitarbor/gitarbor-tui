import { homedir } from 'os'
import { join, basename } from 'path'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import type { WorkspaceConfig, WorkspaceSession, Repository } from '../types/workspace'

const WORKSPACE_DIR = join(homedir(), '.gitarbor')
const WORKSPACE_FILE = join(WORKSPACE_DIR, 'workspace.json')

export class WorkspaceManager {
  private config: WorkspaceConfig = {
    sessions: [],
    recentRepositories: [],
  }

  async initialize(): Promise<void> {
    try {
      // Ensure workspace directory exists
      if (!existsSync(WORKSPACE_DIR)) {
        await mkdir(WORKSPACE_DIR, { recursive: true })
      }

      // Load config if it exists
      if (existsSync(WORKSPACE_FILE)) {
        const data = await readFile(WORKSPACE_FILE, 'utf-8')
        this.config = JSON.parse(data) as WorkspaceConfig
      } else {
        await this.save()
      }
    } catch (error) {
      throw new Error(`Failed to initialize workspace: ${error}`)
    }
  }

  async save(): Promise<void> {
    try {
      await writeFile(WORKSPACE_FILE, JSON.stringify(this.config, null, 2), 'utf-8')
    } catch (error) {
      throw new Error(`Failed to save workspace: ${error}`)
    }
  }

  
  getConfig(): WorkspaceConfig {
    return this.config
  }

  async addRepository(path: string): Promise<Repository> {
    const repo: Repository = {
      id: this.generateId(),
      path,
      name: basename(path),
      lastAccessed: Date.now(),
    }

    // Add to recent repositories (max 10)
    this.config.recentRepositories = [
      repo,
      ...this.config.recentRepositories.filter((r) => r.path !== path),
    ].slice(0, 10)

    await this.save()
    return repo
  }

  async createSession(name: string, repositories: Repository[]): Promise<WorkspaceSession> {
    const session: WorkspaceSession = {
      id: this.generateId(),
      name,
      repositories,
      activeRepositoryId: repositories[0]?.id || '',
      createdAt: Date.now(),
      lastModified: Date.now(),
    }

    this.config.sessions.push(session)
    await this.save()
    return session
  }

  async updateSession(sessionId: string, updates: Partial<WorkspaceSession>): Promise<void> {
    const session = this.config.sessions.find((s) => s.id === sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    Object.assign(session, updates, { lastModified: Date.now() })
    await this.save()
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.config.sessions = this.config.sessions.filter((s) => s.id !== sessionId)
    if (this.config.activeSessionId === sessionId) {
      this.config.activeSessionId = undefined
    }
    await this.save()
  }

  async getSession(sessionId: string): Promise<WorkspaceSession | undefined> {
    return this.config.sessions.find((s) => s.id === sessionId)
  }

  async setActiveSession(sessionId: string | undefined): Promise<void> {
    this.config.activeSessionId = sessionId
    await this.save()
  }

  async addRepositoryToSession(sessionId: string, repository: Repository): Promise<void> {
    const session = this.config.sessions.find((s) => s.id === sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    // Check if repository already exists
    if (!session.repositories.find((r) => r.path === repository.path)) {
      session.repositories.push(repository)
      session.lastModified = Date.now()
      await this.save()
    }
  }

  async removeRepositoryFromSession(sessionId: string, repositoryId: string): Promise<void> {
    const session = this.config.sessions.find((s) => s.id === sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    session.repositories = session.repositories.filter((r) => r.id !== repositoryId)
    if (session.activeRepositoryId === repositoryId) {
      session.activeRepositoryId = session.repositories[0]?.id || ''
    }
    session.lastModified = Date.now()
    await this.save()
  }

  async setActiveRepository(sessionId: string, repositoryId: string): Promise<void> {
    const session = this.config.sessions.find((s) => s.id === sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    const repository = session.repositories.find((r) => r.id === repositoryId)
    if (!repository) {
      throw new Error('Repository not found in session')
    }

    session.activeRepositoryId = repositoryId
    repository.lastAccessed = Date.now()
    await this.save()
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }
}
