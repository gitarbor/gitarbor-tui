import { useMemo, useEffect, useRef } from 'react'
import { SyntaxStyle, parseColor, ScrollBoxRenderable } from '@opentui/core'
import { theme } from '../theme'
import type { GitFile, GitBranch, GitCommit, GitMergeState, GitStash, GitRemote, GitTag, CommandLogEntry } from '../types/git'
import { Fieldset } from './Fieldset'
import { CommandLogView } from './CommandLogView'

interface MainViewProps {
  staged: GitFile[]
  unstaged: GitFile[]
  untracked: GitFile[]
  branches: GitBranch[]
  commits: GitCommit[]
  stashes: GitStash[]
  remotes: GitRemote[]
  tags: GitTag[]
  selectedIndex: number
  focusedPanel: 'status' | 'branches' | 'log' | 'stashes' | 'remotes' | 'tags' | 'diff'
  branchRemoteTab: 'branches' | 'remotes' | 'tags'
  onStage: (path: string) => void
  onUnstage: (path: string) => void
  mergeState?: GitMergeState
  currentBranch: string
  ahead: number
  behind: number
  diff: string
  selectedFilePath?: string
  commandLog: CommandLogEntry[]
  showCommandLog: boolean
}

export function MainView({
  staged,
  unstaged,
  untracked,
  branches,
  commits,
  stashes,
  remotes,
  tags,
  selectedIndex,
  focusedPanel,
  branchRemoteTab,
  mergeState,
  currentBranch,
  ahead,
  behind,
  diff,
  selectedFilePath,
  commandLog,
  showCommandLog,
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

  // Refs for scrollboxes to enable auto-scrolling
  const branchesScrollRef = useRef<ScrollBoxRenderable>(null)
  const remotesScrollRef = useRef<ScrollBoxRenderable>(null)
  const tagsScrollRef = useRef<ScrollBoxRenderable>(null)
  const commitsScrollRef = useRef<ScrollBoxRenderable>(null)

  // Auto-scroll to selected item when selection changes
  useEffect(() => {
    const lineHeight = 1 // Each item is roughly 1 line tall (single line items)
    const remoteLineHeight = 2 // Remotes take 2 lines (name + URL)
    let scrollRef: typeof branchesScrollRef | null = null
    let itemHeight = lineHeight
    
    if (focusedPanel === 'branches' && branchRemoteTab === 'branches') {
      scrollRef = branchesScrollRef
      itemHeight = lineHeight
    } else if (focusedPanel === 'remotes' && branchRemoteTab === 'remotes') {
      scrollRef = remotesScrollRef
      itemHeight = remoteLineHeight
    } else if (focusedPanel === 'tags' && branchRemoteTab === 'tags') {
      scrollRef = tagsScrollRef
      itemHeight = lineHeight
    } else if (focusedPanel === 'log') {
      scrollRef = commitsScrollRef
      itemHeight = lineHeight
    }

    if (scrollRef?.current) {
      // Calculate scroll position with some offset to keep item visible
      // Subtract a small offset to ensure the item isn't at the very bottom
      const scrollPosition = Math.max(0, selectedIndex * itemHeight - 2)
      scrollRef.current.scrollTo({ x: 0, y: scrollPosition })
    }
  }, [selectedIndex, focusedPanel, branchRemoteTab])

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
    <box width="100%" flexGrow={1} flexDirection="column">
      <box width="100%" flexGrow={1} flexDirection="row">
        {/* Left column: Working Directory, Branches/Remotes, and Recent Commits */}
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
          title="Branches / Remotes / Tags"
          focused={focusedPanel === 'branches' || focusedPanel === 'remotes' || focusedPanel === 'tags'}
          height="30%"
          paddingX={theme.spacing.none}
          paddingY={theme.spacing.none}
        >
          <box flexDirection="column" width="100%" height="100%">
            {/* Tab Bar - fixed height */}
            <box flexDirection="row" height={1} paddingLeft={theme.spacing.xs}>
              <text fg={branchRemoteTab === 'branches' ? theme.colors.primary : theme.colors.text.muted}>
                [Branches{branchRemoteTab === 'branches' ? ' ●' : ''}]
              </text>
              <text> </text>
              <text fg={branchRemoteTab === 'remotes' ? theme.colors.primary : theme.colors.text.muted}>
                [Remotes{branchRemoteTab === 'remotes' ? ' ●' : ''}]
              </text>
              <text> </text>
              <text fg={branchRemoteTab === 'tags' ? theme.colors.primary : theme.colors.text.muted}>
                [Tags{branchRemoteTab === 'tags' ? ' ●' : ''}]
              </text>
            </box>

            {/* Tab Content Container - single container that switches content */}
            <box width="100%" flexGrow={1}>
              {branchRemoteTab === 'branches' && (
                localBranches.length === 0 ? (
                  <box paddingLeft={theme.spacing.xs} width="100%" height="100%">
                    <text fg={theme.colors.text.muted}>No branches</text>
                  </box>
                ) : (
                  <scrollbox ref={branchesScrollRef} width="100%" height="100%" flexDirection="column" viewportCulling={true}>
                    {localBranches.map((branch, idx) => {
                      const isSelected = idx === selectedIndex && focusedPanel === 'branches'
                      
                      return (
                        <box key={branch.name} flexDirection="row" paddingLeft={theme.spacing.xs} height={1}>
                          <text fg={isSelected ? theme.colors.primary : theme.colors.border}>
                            {isSelected ? '>' : ' '}
                          </text>
                          <text fg={branch.current ? theme.colors.git.staged : theme.colors.text.secondary}>
                            {branch.current ? ' * ' : '   '}
                            {branch.name}
                          </text>
                        </box>
                      )
                    })}
                  </scrollbox>
                )
              )}

              {branchRemoteTab === 'remotes' && (
                remotes.length === 0 ? (
                  <box paddingLeft={theme.spacing.xs} width="100%" height="100%">
                    <text fg={theme.colors.text.muted}>No remotes configured</text>
                  </box>
                ) : (
                  <scrollbox ref={remotesScrollRef} width="100%" height="100%" flexDirection="column" viewportCulling={true}>
                    {remotes.map((remote, idx) => {
                      const isSelected = idx === selectedIndex && focusedPanel === 'remotes'
                      
                      return (
                        <box key={remote.name} flexDirection="column" paddingLeft={theme.spacing.xs}>
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
                    })}
                  </scrollbox>
                )
              )}

              {branchRemoteTab === 'tags' && (
                tags.length === 0 ? (
                  <box paddingLeft={theme.spacing.xs} width="100%" height="100%">
                    <text fg={theme.colors.text.muted}>No tags</text>
                  </box>
                ) : (
                  <scrollbox ref={tagsScrollRef} width="100%" height="100%" flexDirection="column" viewportCulling={true}>
                    {tags.map((tag, idx) => {
                      const isSelected = idx === selectedIndex && focusedPanel === 'tags'
                      
                      return (
                        <box key={tag.name} flexDirection="row" paddingLeft={theme.spacing.xs} height={1}>
                          <text fg={isSelected ? theme.colors.primary : theme.colors.border}>
                            {isSelected ? '>' : ' '}
                          </text>
                          <text fg={isSelected ? theme.colors.primary : theme.colors.git.modified}>
                            {' '}{tag.isAnnotated ? '◆ ' : '◇ '}{tag.name}
                          </text>
                        </box>
                      )
                    })}
                  </scrollbox>
                )
              )}
            </box>
          </box>
        </Fieldset>

        <Fieldset
          title="Recent Commits"
          focused={focusedPanel === 'log'}
          height="30%"
          paddingX={theme.spacing.none}
          paddingY={theme.spacing.none}
        >
          {commits.length === 0 ? (
            <box paddingLeft={theme.spacing.xs}>
              <text fg={theme.colors.text.muted}>No commits</text>
            </box>
          ) : (
            <scrollbox ref={commitsScrollRef} width="100%" height="100%" flexDirection="column">
              {commits.map((commit, idx) => {
                const isSelected = idx === selectedIndex && focusedPanel === 'log'
                
                return (
                  <box key={commit.hash} flexDirection="row" paddingLeft={theme.spacing.xs}>
                    <text fg={isSelected ? theme.colors.primary : theme.colors.border}>
                      {isSelected ? '>' : ' '}
                    </text>
                    <text fg={theme.colors.git.modified}> {commit.shortHash} </text>
                    <text fg={theme.colors.status.info}>{commit.author.slice(0, 2)}</text>
                    <text fg={theme.colors.text.muted}> - </text>
                    <text fg={isSelected ? theme.colors.text.primary : theme.colors.text.secondary}>
                      {commit.message}
                    </text>
                  </box>
                )
              })}
            </scrollbox>
          )}
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

      {/* Right column: Diff and Command Log */}
      <box width="60%" flexDirection="column">
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

        {/* Command Log below Diff */}
        {showCommandLog && (
          <CommandLogView commandLog={commandLog} maxHeight={10} />
        )}
      </box>
    </box>
  </box>
  )
}
