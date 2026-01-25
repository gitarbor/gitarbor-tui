import { useMemo } from 'react'
import { SyntaxStyle, parseColor } from '@opentui/core'
import { theme } from '../theme'
import type { GitFile, GitBranch, GitCommit, GitMergeState, GitStash, GitRemote } from '../types/git'
import { Fieldset } from './Fieldset'

interface MainViewProps {
  staged: GitFile[]
  unstaged: GitFile[]
  untracked: GitFile[]
  branches: GitBranch[]
  commits: GitCommit[]
  stashes: GitStash[]
  remotes: GitRemote[]
  selectedIndex: number
  focusedPanel: 'status' | 'branches' | 'log' | 'stashes' | 'remotes' | 'diff'
  branchRemoteTab: 'branches' | 'remotes'
  onStage: (path: string) => void
  onUnstage: (path: string) => void
  mergeState?: GitMergeState
  currentBranch: string
  ahead: number
  behind: number
  diff: string
  selectedFilePath?: string
}

export function MainView({
  staged,
  unstaged,
  untracked,
  branches,
  commits,
  stashes,
  remotes,
  selectedIndex,
  focusedPanel,
  branchRemoteTab,
  mergeState,
  currentBranch,
  ahead,
  behind,
  diff,
  selectedFilePath,
}: MainViewProps) {
  // Create syntax style for diff component
  const syntaxStyle = useMemo(() => SyntaxStyle.fromStyles({
    keyword: { fg: parseColor('#FF7B72'), bold: true },
    'keyword.import': { fg: parseColor('#FF7B72'), bold: true },
    string: { fg: parseColor('#A5D6FF') },
    comment: { fg: parseColor('#8B949E'), italic: true },
    number: { fg: parseColor('#79C0FF') },
    boolean: { fg: parseColor('#79C0FF') },
    constant: { fg: parseColor('#79C0FF') },
    function: { fg: parseColor('#D2A8FF') },
    'function.call': { fg: parseColor('#D2A8FF') },
    constructor: { fg: parseColor('#FFA657') },
    type: { fg: parseColor('#FFA657') },
    operator: { fg: parseColor('#FF7B72') },
    variable: { fg: parseColor('#E6EDF3') },
    property: { fg: parseColor('#79C0FF') },
    bracket: { fg: parseColor('#F0F6FC') },
    punctuation: { fg: parseColor('#F0F6FC') },
    default: { fg: parseColor('#E6EDF3') },
  }), [])

  // Determine filetype from file path extension
  const getFiletype = (filePath?: string): string => {
    if (!filePath) return 'text'
    const ext = filePath.split('.').pop()?.toLowerCase()
    const filetypeMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'py': 'python',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'h': 'c',
      'hpp': 'cpp',
      'css': 'css',
      'scss': 'scss',
      'html': 'html',
      'json': 'json',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'sh': 'bash',
      'bash': 'bash',
    }
    return filetypeMap[ext || ''] || 'text'
  }
  
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

  const stagedFiles = staged.map((f) => ({ ...f, section: 'staged' }))
  const unstagedFiles = unstaged.map((f) => ({ ...f, section: 'unstaged' }))
  const untrackedFiles = untracked.map((f) => ({ ...f, section: 'untracked' }))

  return (
    <box width="100%" flexGrow={1} flexDirection="row">
      {/* Left column: Working Directory and Branches/Remotes */}
      <box width="40%" flexDirection="column">
        <Fieldset
          title="Working Directory"
          focused={focusedPanel === 'status'}
          flexGrow={1}
          paddingX={theme.spacing.xs}
          paddingY={theme.spacing.none}
        >
          <box flexDirection="column">
            {mergeState?.inProgress && (
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
            )}
            
            {/* Staged files section */}
            {stagedFiles.length > 0 && (
              <>
                <text fg={theme.colors.git.staged}>Staged ({stagedFiles.length}):</text>
                {stagedFiles.map((file, idx) => {
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
                    </box>
                  )
                })}
                <text> </text>
              </>
            )}

            {/* Unstaged files section */}
            {unstagedFiles.length > 0 && (
              <>
                <text fg={theme.colors.git.modified}>Modified ({unstagedFiles.length}):</text>
                {unstagedFiles.map((file, idx) => {
                  const globalIdx = stagedFiles.length + idx
                  const isSelected = globalIdx === selectedIndex && focusedPanel === 'status'
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
                    </box>
                  )
                })}
                <text> </text>
              </>
            )}

            {/* Untracked files section */}
            {untrackedFiles.length > 0 && (
              <>
                <text fg={theme.colors.text.muted}>Untracked ({untrackedFiles.length}):</text>
                {untrackedFiles.map((file, idx) => {
                  const globalIdx = stagedFiles.length + unstagedFiles.length + idx
                  const isSelected = globalIdx === selectedIndex && focusedPanel === 'status'
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
                    </box>
                  )
                })}
              </>
            )}

            {/* Empty state */}
            {stagedFiles.length === 0 && unstagedFiles.length === 0 && untrackedFiles.length === 0 && (
              <text fg={theme.colors.text.muted}>Working directory clean</text>
            )}
          </box>
        </Fieldset>

        <Fieldset
          title="Branches / Remotes"
          focused={focusedPanel === 'branches' || focusedPanel === 'remotes'}
          height="30%"
          paddingX={theme.spacing.xs}
          paddingY={theme.spacing.none}
        >
          <box flexDirection="column">
            {/* Tab Bar */}
            <box flexDirection="row" marginBottom={theme.spacing.xs}>
              <text fg={branchRemoteTab === 'branches' ? theme.colors.primary : theme.colors.text.muted}>
                [Branches{branchRemoteTab === 'branches' ? ' ●' : ''}]
              </text>
              <text> </text>
              <text fg={branchRemoteTab === 'remotes' ? theme.colors.primary : theme.colors.text.muted}>
                [Remotes{branchRemoteTab === 'remotes' ? ' ●' : ''}]
              </text>
            </box>

            {/* Tab Content: Branches */}
            {branchRemoteTab === 'branches' && (
              <box flexDirection="column">
                {localBranches.length === 0 ? (
                  <text fg={theme.colors.text.muted}>No branches</text>
                ) : (
                  localBranches.slice(0, 15).map((branch, idx) => {
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
                        {branch.upstream && (
                          <text fg={theme.colors.text.muted}> → {branch.upstream.replace('remotes/', '')}</text>
                        )}
                      </box>
                    )
                  })
                )}
              </box>
            )}

            {/* Tab Content: Remotes */}
            {branchRemoteTab === 'remotes' && (
              <box flexDirection="column">
                {remotes.length === 0 ? (
                  <text fg={theme.colors.text.muted}>No remotes configured</text>
                ) : (
                  remotes.map((remote, idx) => {
                    const isSelected = idx === selectedIndex && focusedPanel === 'remotes'
                    
                    return (
                      <box key={remote.name} flexDirection="column">
                        <box flexDirection="row">
                          <text fg={isSelected ? theme.colors.primary : theme.colors.border}>
                            {isSelected ? '>' : ' '}
                          </text>
                          <text fg={isSelected ? theme.colors.primary : theme.colors.text.secondary}>
                            {' '}{remote.name}
                          </text>
                        </box>
                        <box flexDirection="row" paddingLeft={theme.spacing.md}>
                          <text fg={theme.colors.text.muted}>
                            {remote.fetchUrl.length > 40 ? remote.fetchUrl.substring(0, 37) + '...' : remote.fetchUrl}
                          </text>
                        </box>
                      </box>
                    )
                  })
                )}
              </box>
            )}
          </box>
        </Fieldset>

        {stashes.length > 0 && (
          <Fieldset
            title="Stashes"
            focused={focusedPanel === 'stashes'}
            height={Math.min(stashes.length * 3 + 3, 12)}
            paddingX={theme.spacing.xs}
            paddingY={theme.spacing.none}
          >
            <box flexDirection="column">
              {stashes.slice(0, 3).map((stash, idx) => {
                const isSelected = idx === selectedIndex && focusedPanel === 'stashes'
                
                return (
                  <box key={stash.name} flexDirection="column">
                    <box flexDirection="row">
                      <text fg={isSelected ? theme.colors.primary : theme.colors.border}>
                        {isSelected ? '>' : ' '}
                      </text>
                      <text fg={theme.colors.git.modified}> {stash.name} </text>
                      <text fg={theme.colors.text.muted}>({stash.branch})</text>
                    </box>
                    <box flexDirection="row" paddingLeft={theme.spacing.md}>
                      <text fg={isSelected ? theme.colors.text.primary : theme.colors.text.secondary}>
                        {stash.message.length > 50 ? stash.message.substring(0, 47) + '...' : stash.message}
                      </text>
                    </box>
                  </box>
                )
              })}
              {stashes.length > 3 && (
                <text fg={theme.colors.text.muted}>  ...and {stashes.length - 3} more (press 4 for full view)</text>
              )}
            </box>
          </Fieldset>
        )}
      </box>

      {/* Right column: Recent Commits and Diff */}
      <box width="60%" flexDirection="column">
        <Fieldset
          title="Recent Commits"
          focused={focusedPanel === 'log'}
          height="30%"
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

        <Fieldset
          title="Diff"
          focused={focusedPanel === 'diff'}
          flexGrow={1}
          paddingX={theme.spacing.none}
          paddingY={theme.spacing.none}
        >
          {!diff || diff.trim() === '' ? (
            <box paddingLeft={theme.spacing.xs}>
              <text fg={theme.colors.text.muted}>No changes to display</text>
            </box>
          ) : (
            <scrollbox width="100%" height="100%">
              <diff
                diff={diff}
                view="unified"
                filetype={getFiletype(selectedFilePath)}
                syntaxStyle={syntaxStyle}
                showLineNumbers={true}
                wrapMode="none"
                addedBg="#1a4d1a"
                removedBg="#4d1a1a"
                contextBg="transparent"
                addedSignColor={theme.colors.git.added}
                removedSignColor={theme.colors.git.deleted}
                lineNumberFg={theme.colors.text.muted}
                lineNumberBg="transparent"
                addedLineNumberBg="#0d3a0d"
                removedLineNumberBg="#3a0d0d"
                selectionBg={theme.colors.primary}
                selectionFg={theme.colors.text.primary}
                style={{
                  flexGrow: 1,
                  width: '100%',
                  height: '100%',
                }}
              />
            </scrollbox>
          )}
        </Fieldset>
      </box>
    </box>
  )
}
