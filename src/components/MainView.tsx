import { theme } from '../theme'
import type { GitFile, GitBranch, GitCommit, GitMergeState } from '../types/git'
import { Fieldset } from './Fieldset'

interface MainViewProps {
  staged: GitFile[]
  unstaged: GitFile[]
  untracked: GitFile[]
  branches: GitBranch[]
  commits: GitCommit[]
  selectedIndex: number
  focusedPanel: 'status' | 'branches' | 'log'
  onStage: (path: string) => void
  onUnstage: (path: string) => void
  mergeState?: GitMergeState
}

export function MainView({
  staged,
  unstaged,
  untracked,
  branches,
  commits,
  selectedIndex,
  focusedPanel,
  mergeState,
}: MainViewProps) {
  const allFiles = [
    ...staged.map((f) => ({ ...f, section: 'staged' })),
    ...unstaged.map((f) => ({ ...f, section: 'unstaged' })),
    ...untracked.map((f) => ({ ...f, section: 'untracked' })),
  ]

  const getStatusSymbol = (status: string, section: string) => {
    if (section === 'staged') return '✓'
    if (section === 'untracked') return '?'
    switch (status) {
      case 'M': return '~'
      case 'D': return '-'
      case 'A': return '+'
      default: return '•'
    }
  }

  const getSectionColor = (section: string) => {
    if (section === 'staged') return theme.colors.git.staged
    if (section === 'untracked') return theme.colors.text.muted
    return theme.colors.git.modified
  }

  const localBranches = branches.filter((b) => !b.remote)
  const remoteBranches = branches.filter((b) => b.remote)

  return (
    <box width="100%" flexGrow={1} flexDirection="column">
      <box width="100%" flexGrow={1} flexDirection="row">
        <Fieldset
          title="Working Directory Status"
          focused={focusedPanel === 'status'}
          flexGrow={1}
          paddingX={theme.spacing.xs}
          paddingY={theme.spacing.none}
        >
          <box flexDirection="column">
            {mergeState?.inProgress && (
              <>
                <box
                  borderStyle={theme.borders.style}
                  borderColor={theme.colors.status.warning}
                  padding={theme.spacing.xs}
                  marginBottom={theme.spacing.xs}
                >
                  <text fg={theme.colors.status.warning}>⚠ MERGE IN PROGRESS</text>
                  <text> </text>
                  {mergeState.mergingBranch && (
                    <text fg={theme.colors.text.secondary}>
                      Merging '{mergeState.mergingBranch}' into '{mergeState.currentBranch}'
                    </text>
                  )}
                  <text> </text>
                  {mergeState.conflicts.length > 0 && (
                    <text fg={theme.colors.status.error}>
                      {mergeState.conflicts.length} conflict{mergeState.conflicts.length !== 1 ? 's' : ''} - Press 'C' to resolve
                    </text>
                  )}
                  {mergeState.conflicts.length === 0 && (
                    <text fg={theme.colors.git.staged}>All conflicts resolved - ready to commit</text>
                  )}
                </box>
              </>
            )}
            
            {allFiles.length === 0 ? (
              <text fg={theme.colors.text.muted}>No changes</text>
            ) : (
              allFiles.map((file, idx) => {
                const isSelected = idx === selectedIndex && focusedPanel === 'status'
                const symbol = getStatusSymbol(file.status, file.section)
                const color = getSectionColor(file.section)
                
                return (
                  <box key={file.path} flexDirection="row">
                    <text fg={isSelected ? theme.colors.primary : theme.colors.border}>
                      {isSelected ? '>' : ' '}
                    </text>
                    <text fg={color}> {symbol} </text>
                    <text fg={isSelected ? theme.colors.text.primary : theme.colors.text.secondary}>
                      {file.path}
                    </text>
                    <text fg={theme.colors.text.muted}> ({file.section})</text>
                  </box>
                )
              })
            )}
          </box>
        </Fieldset>

        <Fieldset
          title="Branches"
          focused={focusedPanel === 'branches'}
          flexGrow={1}
          paddingX={theme.spacing.xs}
          paddingY={theme.spacing.none}
        >
          <box flexDirection="column">
            <text fg={theme.colors.git.staged}>Local:</text>
            {localBranches.map((branch, idx) => {
              const isSelected = idx === selectedIndex && focusedPanel === 'branches'
              
              return (
                <box key={branch.name} flexDirection="row">
                  <text fg={isSelected ? theme.colors.primary : theme.colors.border}>
                    {isSelected ? '>' : ' '}
                  </text>
                  <text fg={branch.current ? theme.colors.git.staged : theme.colors.text.secondary}>
                    {branch.current ? '* ' : '  '}
                    {branch.name}
                  </text>
                </box>
              )
            })}
            <text> </text>
            <text fg={theme.colors.status.info}>Remote:</text>
            {remoteBranches.slice(0, 10).map((branch) => {
              return (
                <box key={branch.name} flexDirection="row">
                  <text fg={theme.colors.text.muted}>  {branch.name}</text>
                </box>
              )
            })}
          </box>
        </Fieldset>
      </box>

      <Fieldset
        title="Commit History"
        focused={focusedPanel === 'log'}
        height="40%"
        paddingX={theme.spacing.xs}
        paddingY={theme.spacing.none}
      >
        <box flexDirection="column">
          {commits.length === 0 ? (
            <text fg={theme.colors.text.muted}>No commits</text>
          ) : (
            commits.slice(0, 10).map((commit, idx) => {
              const isSelected = idx === selectedIndex && focusedPanel === 'log'
              
              return (
                <box key={commit.hash} flexDirection="row">
                  <text fg={isSelected ? theme.colors.primary : theme.colors.border}>
                    {isSelected ? '>' : ' '}
                  </text>
                  <text fg={theme.colors.git.modified}> {commit.shortHash} </text>
                  <text fg={theme.colors.text.muted}>{commit.date}</text>
                  <text fg={theme.colors.text.muted}> - </text>
                  <text fg={theme.colors.status.info}>{commit.author}</text>
                  <text fg={theme.colors.text.muted}> - </text>
                  <text fg={isSelected ? theme.colors.text.primary : theme.colors.text.secondary}>
                    {commit.message}
                  </text>
                </box>
              )
            })
          )}
        </box>
      </Fieldset>
    </box>
  )
}
