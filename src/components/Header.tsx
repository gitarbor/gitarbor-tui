import { theme } from '../theme'

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
      borderStyle={theme.borders.style}
      borderColor={theme.colors.border}
      padding={theme.spacing.none}
    >
      <box flexDirection="row" paddingLeft={theme.spacing.xs} paddingTop={theme.spacing.none}>
        <text fg={theme.colors.primary}>GitArbor</text>
        <text fg={theme.colors.text.muted}> - </text>
        <text fg={theme.colors.git.modified}>{branch}</text>
        <text fg={theme.colors.text.muted}>{aheadBehind}</text>
        <text fg={theme.colors.text.muted}> | View: </text>
        <text fg={theme.colors.primary}>{view}</text>
      </box>
    </box>
  )
}
