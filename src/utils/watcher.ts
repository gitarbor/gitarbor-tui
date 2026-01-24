import { watch } from 'fs'
import { join } from 'path'
import type { FSWatcher } from 'fs'

export class FileSystemWatcher {
  private watchers: FSWatcher[] = []
  private debounceTimer: ReturnType<typeof setTimeout> | null = null
  private readonly debounceMs: number
  private callback: () => void

  constructor(
    private cwd: string,
    onChange: () => void,
    debounceMs: number = 300
  ) {
    this.debounceMs = debounceMs
    this.callback = onChange
  }

  setCallback(callback: () => void): void {
    this.callback = callback
  }

  start(): void {
    try {
      // Watch the working directory for file changes
      const workingDirWatcher = watch(
        this.cwd,
        { recursive: true },
        (eventType, filename) => {
          if (filename && this.shouldTriggerUpdate(filename)) {
            this.triggerDebounced()
          }
        }
      )
      this.watchers.push(workingDirWatcher)

      // Watch the .git directory for git operations
      const gitDirPath = join(this.cwd, '.git')
      const gitDirWatcher = watch(
        gitDirPath,
        { recursive: true },
        (eventType, filename) => {
          if (filename && this.isGitStatusFile(filename)) {
            this.triggerDebounced()
          }
        }
      )
      this.watchers.push(gitDirWatcher)
    } catch (error) {
      // Silently fail if watching is not possible
      console.error('Failed to start file watcher:', error)
    }
  }

  stop(): void {
    // Clear any pending debounce
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }

    // Close all watchers
    for (const watcher of this.watchers) {
      watcher.close()
    }
    this.watchers = []
  }

  private shouldTriggerUpdate(filename: string): boolean {
    // Ignore .git directory changes (handled separately)
    if (filename.startsWith('.git/')) {
      return false
    }

    // Ignore node_modules and other common directories
    if (
      filename.includes('node_modules/') ||
      filename.includes('.DS_Store') ||
      filename.includes('/.') // Ignore hidden files/folders except .git
    ) {
      return false
    }

    return true
  }

  private isGitStatusFile(filename: string): boolean {
    // Watch for changes to git's index and refs
    return (
      filename.includes('index') ||
      filename.includes('HEAD') ||
      filename.includes('refs/') ||
      filename.includes('COMMIT_EDITMSG')
    )
  }

  private triggerDebounced(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      this.callback()
      this.debounceTimer = null
    }, this.debounceMs)
  }
}
