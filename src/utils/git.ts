import { exec } from 'child_process'
import { promisify } from 'util'
import type { GitStatus, GitFile, GitCommit, GitBranch } from '../types/git'

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
      const { stdout } = await execAsync('git branch -a', { cwd: this.cwd })
      
      return stdout
        .split('\n')
        .filter((line) => line)
        .map((line) => {
          const current = line.startsWith('*')
          const name = line.replace(/^\*?\s+/, '').trim()
          const remote = name.startsWith('remotes/')
          return { name, current, remote }
        })
    } catch (error) {
      throw new Error(`Failed to get branches: ${error}`)
    }
  }

  async stageFile(path: string): Promise<void> {
    try {
      await execAsync(`git add "${path}"`, { cwd: this.cwd })
    } catch (error) {
      throw new Error(`Failed to stage file: ${error}`)
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
}
