import { exec } from 'child_process'
import { promisify } from 'util'
import type { GitStatus, GitFile, GitCommit, GitBranch, GitStash } from '../types/git'

const execAsync = promisify(exec)

export class GitClient {
  constructor(private cwd: string) {}

  async getStatus(): Promise<GitStatus> {
    try {
      const { stdout: branchOut } = await execAsync('git branch --show-current', { cwd: this.cwd })
      const branch = branchOut.trim()

      // Get ahead/behind info
      let ahead = 0
      let behind = 0
      try {
        const { stdout: revOut } = await execAsync(
          `git rev-list --left-right --count HEAD...@{upstream}`,
          { cwd: this.cwd }
        )
        const [aheadStr, behindStr] = revOut.trim().split('\t')
        ahead = parseInt(aheadStr || '0', 10)
        behind = parseInt(behindStr || '0', 10)
      } catch {
        // No upstream branch
      }

      const { stdout: statusOut } = await execAsync('git status --porcelain', { cwd: this.cwd })
      
      const staged: GitFile[] = []
      const unstaged: GitFile[] = []
      const untracked: GitFile[] = []

      statusOut.split('\n').forEach((line) => {
        if (!line) return
        
        const status = line.substring(0, 2)
        const path = line.substring(3)
        
        if (status[0] === '?' && status[1] === '?') {
          untracked.push({ path, status: 'untracked', staged: false })
        } else {
          if (status[0] !== ' ' && status[0] !== '?') {
            staged.push({ path, status: status[0] || '', staged: true })
          }
          if (status[1] !== ' ' && status[1] !== '?') {
            unstaged.push({ path, status: status[1] || '', staged: false })
          }
        }
      })

      return { branch, ahead, behind, staged, unstaged, untracked }
    } catch (error) {
      throw new Error(`Failed to get git status: ${error}`)
    }
  }

  async getLog(count: number = 50): Promise<GitCommit[]> {
    try {
      const format = '%H%x00%h%x00%an%x00%ar%x00%s'
      const { stdout } = await execAsync(
        `git log -n ${count} --pretty=format:"${format}"`,
        { cwd: this.cwd }
      )

      return stdout
        .split('\n')
        .filter((line) => line)
        .map((line) => {
          const [hash, shortHash, author, date, message] = line.split('\x00')
          return { hash: hash!, shortHash: shortHash!, author: author!, date: date!, message: message! }
        })
    } catch (error) {
      throw new Error(`Failed to get git log: ${error}`)
    }
  }

  async getBranches(): Promise<GitBranch[]> {
    try {
      // Get branch list with verbose info
      const { stdout } = await execAsync(
        'git branch -a -vv --format="%(refname:short)|%(upstream:short)|%(authordate:relative)|%(HEAD)"',
        { cwd: this.cwd }
      )
      
      const branches = stdout
        .split('\n')
        .filter((line) => line)
        .map((line) => {
          const [name, upstream, date, head] = line.split('|')
          const remote = name!.startsWith('remotes/')
          const current = head === '*'
          
          const branch: GitBranch = {
            name: name!,
            current,
            remote,
          }
          
          if (upstream) {
            branch.upstream = upstream
          }
          if (date) {
            branch.lastCommitDate = date
          }
          
          return branch
        })

      // Try to get branch descriptions
      for (const branch of branches) {
        if (!branch.remote) {
          try {
            const { stdout: desc } = await execAsync(
              `git config branch.${branch.name}.description`,
              { cwd: this.cwd }
            )
            const trimmed = desc.trim()
            if (trimmed.length > 0) {
              branch.description = trimmed
            }
          } catch {
            // No description set
          }
        }
      }

      return branches
    } catch (error) {
      throw new Error(`Failed to get branches: ${error}`)
    }
  }

  async createBranch(name: string, startPoint?: string): Promise<void> {
    try {
      const startArg = startPoint ? ` "${startPoint}"` : ''
      await execAsync(`git branch "${name}"${startArg}`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to create branch: ${error}`)
    }
  }

  async deleteBranch(name: string, force: boolean = false): Promise<void> {
    try {
      const flag = force ? '-D' : '-d'
      await execAsync(`git branch ${flag} "${name}"`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to delete branch: ${error}`)
    }
  }

  async deleteRemoteBranch(remote: string, branch: string): Promise<void> {
    try {
      await execAsync(`git push "${remote}" --delete "${branch}"`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to delete remote branch: ${error}`)
    }
  }

  async renameBranch(oldName: string, newName: string): Promise<void> {
    try {
      await execAsync(`git branch -m "${oldName}" "${newName}"`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to rename branch: ${error}`)
    }
  }

  async setUpstream(branch: string, upstream: string): Promise<void> {
    try {
      await execAsync(`git branch --set-upstream-to="${upstream}" "${branch}"`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to set upstream: ${error}`)
    }
  }

  async unsetUpstream(branch: string): Promise<void> {
    try {
      await execAsync(`git branch --unset-upstream "${branch}"`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to unset upstream: ${error}`)
    }
  }

  async setBranchDescription(branch: string, description: string): Promise<void> {
    try {
      await execAsync(
        `git config branch.${branch}.description "${description.replace(/"/g, '\\"')}"`,
        { cwd: this.cwd }
      )
    } catch (error) {
      throw new Error(`Failed to set branch description: ${error}`)
    }
  }

  async checkBranchMergeStatus(branch: string): Promise<{ merged: boolean; hasUnpushed: boolean }> {
    try {
      // Check if branch is merged into current branch
      let merged = false
      try {
        const { stdout } = await execAsync(`git branch --merged`, { cwd: this.cwd })
        merged = stdout.split('\n').some((line) => line.trim() === branch)
      } catch {
        // Error checking merge status
      }

      // Check if branch has unpushed commits
      let hasUnpushed = false
      try {
        const { stdout } = await execAsync(
          `git log @{upstream}..HEAD --oneline`,
          { cwd: this.cwd }
        )
        hasUnpushed = stdout.trim().length > 0
      } catch {
        // No upstream or error checking
      }

      return { merged, hasUnpushed }
    } catch (error) {
      throw new Error(`Failed to check branch status: ${error}`)
    }
  }

  async stageFile(path: string): Promise<void> {
    try {
      await execAsync(`git add "${path}"`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to stage file: ${error}`)
    }
  }

  async stageAll(): Promise<void> {
    try {
      await execAsync('git add -A', { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to stage all files: ${error}`)
    }
  }

  async unstageFile(path: string): Promise<void> {
    try {
      await execAsync(`git reset HEAD "${path}"`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to unstage file: ${error}`)
    }
  }

  async commit(message: string): Promise<void> {
    try {
      await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to commit: ${error}`)
    }
  }

  async checkout(branch: string): Promise<void> {
    try {
      // Remove remotes/ prefix if present
      const branchName = branch.replace(/^remotes\/[^/]+\//, '')
      await execAsync(`git checkout "${branchName}"`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to checkout branch: ${error}`)
    }
  }

  async getDiff(path?: string): Promise<string> {
    try {
      const pathArg = path ? `-- "${path}"` : ''
      const { stdout } = await execAsync(`git diff ${pathArg}`, { cwd: this.cwd })
      return stdout
    } catch (error) {
      throw new Error(`Failed to get diff: ${error}`)
    }
  }

  async getStagedDiff(path?: string): Promise<string> {
    try {
      const pathArg = path ? `-- "${path}"` : ''
      const { stdout } = await execAsync(`git diff --staged ${pathArg}`, { cwd: this.cwd })
      return stdout
    } catch (error) {
      throw new Error(`Failed to get staged diff: ${error}`)
    }
  }

  async push(onProgress?: (line: string) => void): Promise<void> {
    try {
      const { spawn } = await import('child_process')
      
      return new Promise((resolve, reject) => {
        const gitProcess = spawn('git', ['push', '--progress'], {
          cwd: this.cwd,
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        })

        let errorOutput = ''

        gitProcess.stderr.on('data', (data: Buffer) => {
          const lines = data.toString().split('\n')
          lines.forEach((line: string) => {
            if (line.trim()) {
              onProgress?.(line.trim())
              errorOutput += line + '\n'
            }
          })
        })

        gitProcess.stdout.on('data', (data: Buffer) => {
          const lines = data.toString().split('\n')
          lines.forEach((line: string) => {
            if (line.trim()) {
              onProgress?.(line.trim())
            }
          })
        })

        gitProcess.on('close', (code: number | null) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(errorOutput || `Push failed with code ${code}`))
          }
        })

        gitProcess.on('error', (error: Error) => {
          reject(new Error(`Failed to push: ${error.message}`))
        })
      })
    } catch (error) {
      throw new Error(`Failed to push: ${error}`)
    }
  }

  async pull(onProgress?: (line: string) => void): Promise<void> {
    try {
      const { spawn } = await import('child_process')
      
      return new Promise((resolve, reject) => {
        const gitProcess = spawn('git', ['pull', '--progress'], {
          cwd: this.cwd,
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        })

        let errorOutput = ''

        gitProcess.stderr.on('data', (data: Buffer) => {
          const lines = data.toString().split('\n')
          lines.forEach((line: string) => {
            if (line.trim()) {
              onProgress?.(line.trim())
              errorOutput += line + '\n'
            }
          })
        })

        gitProcess.stdout.on('data', (data: Buffer) => {
          const lines = data.toString().split('\n')
          lines.forEach((line: string) => {
            if (line.trim()) {
              onProgress?.(line.trim())
            }
          })
        })

        gitProcess.on('close', (code: number | null) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(errorOutput || `Pull failed with code ${code}`))
          }
        })

        gitProcess.on('error', (error: Error) => {
          reject(new Error(`Failed to pull: ${error.message}`))
        })
      })
    } catch (error) {
      throw new Error(`Failed to pull: ${error}`)
    }
  }

  async fetch(onProgress?: (line: string) => void): Promise<void> {
    try {
      const { spawn } = await import('child_process')
      
      return new Promise((resolve, reject) => {
        const gitProcess = spawn('git', ['fetch', '--progress', '--all'], {
          cwd: this.cwd,
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        })

        let errorOutput = ''

        gitProcess.stderr.on('data', (data: Buffer) => {
          const lines = data.toString().split('\n')
          lines.forEach((line: string) => {
            if (line.trim()) {
              onProgress?.(line.trim())
              errorOutput += line + '\n'
            }
          })
        })

        gitProcess.stdout.on('data', (data: Buffer) => {
          const lines = data.toString().split('\n')
          lines.forEach((line: string) => {
            if (line.trim()) {
              onProgress?.(line.trim())
            }
          })
        })

        gitProcess.on('close', (code: number | null) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(errorOutput || `Fetch failed with code ${code}`))
          }
        })

        gitProcess.on('error', (error: Error) => {
          reject(new Error(`Failed to fetch: ${error.message}`))
        })
      })
    } catch (error) {
      throw new Error(`Failed to fetch: ${error}`)
    }
  }

  async getStashes(): Promise<GitStash[]> {
    try {
      const { stdout } = await execAsync('git stash list', { cwd: this.cwd })
      
      if (!stdout.trim()) {
        return []
      }

      return stdout
        .split('\n')
        .filter((line) => line)
        .map((line) => {
          // Format: stash@{0}: WIP on main: 1234567 commit message
          // or: stash@{0}: On main: custom message
          const match = line.match(/^(stash@\{(\d+)\}): (?:WIP on|On) ([^:]+): (.+)$/)
          if (match) {
            const [, name, indexStr, branch, message] = match
            return {
              name: name!,
              index: parseInt(indexStr!, 10),
              branch: branch!,
              message: message!,
            }
          }
          // Fallback parsing
          const colonIndex = line.indexOf(':')
          const name = line.substring(0, colonIndex)
          const indexMatch = name.match(/\{(\d+)\}/)
          const index = indexMatch ? parseInt(indexMatch[1]!, 10) : 0
          return {
            name,
            index,
            branch: 'unknown',
            message: line.substring(colonIndex + 1).trim(),
          }
        })
    } catch (error) {
      throw new Error(`Failed to get stashes: ${error}`)
    }
  }

  async createStash(message?: string): Promise<void> {
    try {
      if (message) {
        await execAsync(`git stash push -m "${message.replace(/"/g, '\\"')}"`, { cwd: this.cwd })
      } else {
        await execAsync('git stash push', { cwd: this.cwd })
      }
    } catch (error) {
      throw new Error(`Failed to create stash: ${error}`)
    }
  }

  async applyStash(index: number): Promise<void> {
    try {
      await execAsync(`git stash apply stash@{${index}}`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to apply stash: ${error}`)
    }
  }

  async popStash(index: number): Promise<void> {
    try {
      await execAsync(`git stash pop stash@{${index}}`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to pop stash: ${error}`)
    }
  }

  async dropStash(index: number): Promise<void> {
    try {
      await execAsync(`git stash drop stash@{${index}}`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to drop stash: ${error}`)
    }
  }

  async getStashDiff(index: number): Promise<string> {
    try {
      const { stdout } = await execAsync(`git stash show -p stash@{${index}}`, { cwd: this.cwd })
      return stdout
    } catch (error) {
      throw new Error(`Failed to get stash diff: ${error}`)
    }
  }

  async unstageAll(): Promise<void> {
    try {
      await execAsync('git reset HEAD', { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to unstage all files: ${error}`)
    }
  }

  async discardChanges(path: string): Promise<void> {
    try {
      await execAsync(`git checkout -- "${path}"`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to discard changes: ${error}`)
    }
  }

  async deleteUntrackedFile(path: string): Promise<void> {
    try {
      await execAsync(`git clean -f "${path}"`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to delete untracked file: ${error}`)
    }
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    try {
      await execAsync(`git mv "${oldPath}" "${newPath}"`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to rename file: ${error}`)
    }
  }
}
