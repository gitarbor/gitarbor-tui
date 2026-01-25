import { theme } from '../theme'

interface FooterProps {
  message: string
}

export function Footer({ message }: FooterProps) {
  return (
    <box
      width="100%"
      height={5}
      borderStyle={theme.borders.style}
      borderColor={theme.colors.border}
      padding={theme.spacing.none}
    >
      <box paddingLeft={theme.spacing.xs} paddingTop={theme.spacing.none}>
        <text fg={theme.colors.text.muted}>Commands: [/] Palette | [,] Settings | [P] Push | [p] Pull | [f] Fetch | [c] Commit | [s] Stage | [u] Unstage | [ESC/q] Exit</text>
        {message && (
          <text fg={theme.colors.primary}>{message}</text>
        )}
      </box>
    </box>
  )
}
