import { theme } from '../theme'

interface FooterProps {
  message: string
}

export function Footer({ message }: FooterProps) {
  return (
    <box
      width="100%"
      height={6}
      borderStyle={theme.borders.style}
      borderColor={theme.colors.border}
      padding={theme.spacing.none}
      flexDirection="column"
    >
      <box paddingLeft={theme.spacing.xs} paddingTop={theme.spacing.none}>
        <text fg={theme.colors.text.muted}>Commands: [/] Palette | [,] Settings | [P] Push | [p] Pull | [f] Fetch | [c] Commit | [s] Stash</text>
      </box>
      <box paddingLeft={theme.spacing.xs} paddingTop={theme.spacing.none}>
        <text fg={theme.colors.text.muted}>File Ops: [SPACE] Stage/Unstage | [a] Stage All | [A] Unstage All | [d] Discard | [D] Delete | [r] Rename | [ESC/q] Exit</text>
      </box>
      {message && (
        <box paddingLeft={theme.spacing.xs}>
          <text fg={theme.colors.primary}>{message}</text>
        </box>
      )}
    </box>
  )
}
