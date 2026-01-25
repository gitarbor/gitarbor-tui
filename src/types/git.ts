export interface GitStatus {
  branch: string
  ahead: number
  behind: number
  staged: GitFile[]
  unstaged: GitFile[]
  untracked: GitFile[]
}

export interface GitFile {
  path: string
  status: string
  staged: boolean
}

export interface GitCommit {
  hash: string
  shortHash: string
  author: string
  date: string
  message: string
}

export interface GitBranch {
  name: string
  current: boolean
  remote: boolean
}

export interface GitStash {
  index: number
  name: string
  branch: string
  message: string
}

export type View = 'main' | 'log' | 'diff' | 'stash'
