import type { GitBranch } from '../types/git'

interface BranchesViewProps {
  branches: GitBranch[]
  selectedIndex: number
  focused: boolean
}

export function BranchesView({ branches, selectedIndex, focused }: BranchesViewProps) {
  const localBranches = branches.filter((b) => !b.remote)
  const remoteBranches = branches.filter((b) => b.remote)

  return (
    <box
      width="100%"
      flexGrow={1}
      borderStyle="single"
      borderColor={focused ? '#CC8844' : '#555555'}
      padding={0}
    >
      <box paddingLeft={1} paddingTop={0}>
        <text fg="#FFFFFF">Branches</text>
        <text> </text>
        <text fg="#00FF00">Local:</text>
        {localBranches.map((branch, idx) => {
          const isSelected = idx === selectedIndex
          
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
    </box>
  )
}
