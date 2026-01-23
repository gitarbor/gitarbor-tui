import type { ReactNode } from 'react'

interface HeaderProps {
  branch: string
  ahead: number
  behind: number
  view: string
}

export function Header({ branch, ahead, behind, view }: HeaderProps) {
  const aheadBehind = ahead > 0 || behind > 0
    ? ` [↑${ahead} ↓${behind}]`
    : ''

  return (
    <box
      width="100%"
      height={3}
      borderStyle="single"
      borderColor="#555555"
      padding={0}
    >
      <box flexDirection="row" paddingLeft={1} paddingTop={0}>
        <text fg="#CC8844">GitArbor</text>
        <text fg="#999999"> - </text>
        <text fg="#FFFF00">{branch}</text>
        <text fg="#999999">{aheadBehind}</text>
        <text fg="#999999"> | View: </text>
        <text fg="#CC8844">{view}</text>
      </box>
    </box>
  )
}
