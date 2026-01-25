import { theme } from '../theme'
import type { GitTag } from '../types/git'

interface TagDetailsViewProps {
  tag: GitTag
}

export function TagDetailsView({ tag }: TagDetailsViewProps) {
  return (
    <box
      flexDirection="column"
      width="100%"
      height="100%"
      borderStyle={theme.borders.style}
      borderColor={theme.colors.primary}
      padding={theme.spacing.xs}
    >
      <box flexDirection="row" marginBottom={theme.spacing.xs}>
        <text fg={theme.colors.primary}>Tag: </text>
        <text fg={theme.colors.git.modified}>{tag.name}</text>
        <text fg={theme.colors.text.muted}> ({tag.isAnnotated ? 'annotated' : 'lightweight'})</text>
      </box>
      
      <box flexDirection="row" marginBottom={theme.spacing.xs}>
        <text fg={theme.colors.primary}>Commit: </text>
        <text fg={theme.colors.git.modified}>{tag.commit.substring(0, 8)}</text>
      </box>
      
      <box flexDirection="row" marginBottom={theme.spacing.xs}>
        <text fg={theme.colors.primary}>Date: </text>
        <text fg={theme.colors.text.secondary}>{tag.date}</text>
      </box>
      
      {tag.message && (
        <>
          <text fg={theme.colors.primary}>Message:</text>
          <box
            flexDirection="column"
            marginTop={theme.spacing.xs}
            padding={theme.spacing.xs}
            borderStyle={theme.borders.style}
            borderColor={theme.colors.border}
            flexGrow={1}
          >
            <text fg={theme.colors.text.primary}>{tag.message}</text>
          </box>
        </>
      )}
      
      {!tag.message && (
        <box flexGrow={1}>
          <text fg={theme.colors.text.muted}>No annotation message</text>
        </box>
      )}
      
      <box
        marginTop={theme.spacing.xs}
        borderStyle={theme.borders.style}
        borderColor={theme.colors.border}
        padding={theme.spacing.none}
      >
        <text fg={theme.colors.text.muted}>
          [ESC] Back | [D] Delete | [P] Push | [ENTER] Checkout
        </text>
      </box>
    </box>
  )
}
