import type { GitFile } from '../types/git'

interface StatusViewProps {
  staged: GitFile[]
  unstaged: GitFile[]
  untracked: GitFile[]
  selectedIndex: number
  focused: boolean
  onStage: (path: string) => void
  onUnstage: (path: string) => void
}

export function StatusView({
  staged,
  unstaged,
  untracked,
  selectedIndex,
  focused,
}: StatusViewProps) {
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

  return (
    <box
      width="100%"
      flexGrow={1}
      borderStyle="single"
      borderColor={focused ? '#CC8844' : '#555555'}
      padding={0}
    >
      <box paddingLeft={1} paddingTop={0}>
        <text fg="#FFFFFF">Working Directory Status</text>
        <text> </text>
        {allFiles.length === 0 ? (
          <text fg="#999999">No changes</text>
        ) : (
          allFiles.map((file, idx) => {
            const isSelected = idx === selectedIndex
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
    </box>
  )
}
