import type { GitFile, GitBranch, GitCommit } from '../types/git'
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
}

export function MainView({
  staged,
  unstaged,
  untracked,
  branches,
  commits,
  selectedIndex,
  focusedPanel,
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
    if (section === 'staged') return '#00FF00'
    if (section === 'untracked') return '#999999'
    return '#FFFF00'
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
          paddingX={1}
          paddingY={0}
        >
          <box flexDirection="column">
            {allFiles.length === 0 ? (
              <text fg="#999999">No changes</text>
            ) : (
              allFiles.map((file, idx) => {
                const isSelected = idx === selectedIndex && focusedPanel === 'status'
                const symbol = getStatusSymbol(file.status, file.section)
                const color = getSectionColor(file.section)
                
                return (
                  <box key={file.path} flexDirection="row">
                    <text fg={isSelected ? '#CC8844' : '#555555'}>
                      {isSelected ? '>' : ' '}
                    </text>
                    <text fg={color}> {symbol} </text>
                    <text fg={isSelected ? '#FFFFFF' : '#CCCCCC'}>
                      {file.path}
                    </text>
                    <text fg="#666666"> ({file.section})</text>
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
          paddingX={1}
          paddingY={0}
        >
          <box flexDirection="column">
            <text fg="#00FF00">Local:</text>
            {localBranches.map((branch, idx) => {
              const isSelected = idx === selectedIndex && focusedPanel === 'branches'
              
              return (
                <box key={branch.name} flexDirection="row">
                  <text fg={isSelected ? '#CC8844' : '#555555'}>
                    {isSelected ? '>' : ' '}
                  </text>
                  <text fg={branch.current ? '#00FF00' : '#CCCCCC'}>
                    {branch.current ? '* ' : '  '}
                    {branch.name}
                  </text>
                </box>
              )
            })}
            <text> </text>
            <text fg="#00FFFF">Remote:</text>
            {remoteBranches.slice(0, 10).map((branch) => {
              return (
                <box key={branch.name} flexDirection="row">
                  <text fg="#999999">  {branch.name}</text>
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
        paddingX={1}
        paddingY={0}
      >
        <box flexDirection="column">
          {commits.length === 0 ? (
            <text fg="#999999">No commits</text>
          ) : (
            commits.slice(0, 10).map((commit, idx) => {
              const isSelected = idx === selectedIndex && focusedPanel === 'log'
              
              return (
                <box key={commit.hash} flexDirection="row">
                  <text fg={isSelected ? '#CC8844' : '#555555'}>
                    {isSelected ? '>' : ' '}
                  </text>
                  <text fg="#FFFF00"> {commit.shortHash} </text>
                  <text fg="#999999">{commit.date}</text>
                  <text fg="#999999"> - </text>
                  <text fg="#00FFFF">{commit.author}</text>
                  <text fg="#999999"> - </text>
                  <text fg={isSelected ? '#FFFFFF' : '#CCCCCC'}>
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
