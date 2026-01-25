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
  upstream?: string
  lastCommitDate?: string
  description?: string
  ahead?: number
  behind?: number
}

export interface GitStash {
  index: number
  name: string
  branch: string
  message: string
}

export interface GitMergeState {
  inProgress: boolean
  currentBranch: string
  mergingBranch?: string
  conflicts: GitConflict[]
}

export interface GitConflict {
  path: string
  ours: string
  theirs: string
  base?: string
  conflictMarkers: ConflictMarker[]
}

export interface ConflictMarker {
  startLine: number
  endLine: number
  oursStart: number
  oursEnd: number
  theirsStart: number
  theirsEnd: number
}

export type MergeStrategy = 'default' | 'no-ff' | 'ff-only'

export type View = 'main' | 'log' | 'diff' | 'stash'
