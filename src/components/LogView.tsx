import type { GitCommit } from '../types/git'

interface LogViewProps {
  commits: GitCommit[]
  selectedIndex: number
  focused: boolean
}

export function LogView({ commits, selectedIndex, focused }: LogViewProps) {
  return (
    <box
      width="100%"
      flexGrow={1}
      borderStyle="single"
      borderColor={focused ? '#CC8844' : '#555555'}
      padding={0}
    >
      <box paddingLeft={1} paddingTop={0}>
        <text fg="#FFFFFF">Commit History</text>
        <text> </text>
        {commits.length === 0 ? (
          <text fg="#999999">No commits</text>
        ) : (
          commits.map((commit, idx) => {
            const isSelected = idx === selectedIndex
            
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
    </box>
  )
}
