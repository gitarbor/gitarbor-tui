import { theme } from '../theme'
import type { View } from '../types/git'

interface FooterProps {
  view: View
  focusedPanel?: 'status' | 'branches' | 'log' | 'stashes' | 'remotes' | 'tags' | 'diff'
  hasStaged?: boolean
  hasUnstaged?: boolean
  hasUntracked?: boolean
  hasStashes?: boolean
  mergeInProgress?: boolean
}

export function Footer({ 
  view, 
  focusedPanel,
  hasStaged = false,
  hasUnstaged = false,
  hasUntracked = false,
  hasStashes = false,
  mergeInProgress = false,
}: FooterProps) {
  const getContextualCommands = (): { line1: string; line2: string } => {
    // Global commands that are always available
    const globalCommands = '[/] Palette | [P] Push | [p] Pull | [f] Fetch'
    
    // View-specific and context-specific commands
    if (view === 'main' && focusedPanel === 'status') {
      const line1 = `${globalCommands} | [c] Commit | [s] Stash`
      const line2 = '[SPACE] Stage/Unstage | [a] Stage All | [A] Unstage All | [d] Discard | [D] Delete | [r] Rename | [TAB/Shift+TAB] Panels | [ESC/q] Exit'
      return { line1, line2 }
    } else if (view === 'main' && focusedPanel === 'branches') {
      const line1 = `${globalCommands} | [ENTER] Checkout | [m] Merge`
      const line2 = '[n] New Branch | [D] Delete | [R] Rename | [u] Set Upstream | [U] Unset Upstream | [TAB/Shift+TAB] Panels | [ESC/q] Exit'
      return { line1, line2 }
    } else if (view === 'main' && focusedPanel === 'log') {
      const line1 = `${globalCommands} | [ENTER] View Diff`
      const line2 = '[y] Cherry-pick | [R] Revert | [X] Reset | [Y] Copy Hash | [t] Tag | [TAB/Shift+TAB] Panels | [ESC/q] Exit'
      return { line1, line2 }
    } else if (view === 'main' && focusedPanel === 'stashes') {
      const line1 = `${globalCommands} | [s] Create Stash`
      const line2 = '[ENTER] Apply | [P] Pop | [D] Drop | [V] View Diff | [4] Full Stash View | [TAB/Shift+TAB] Panels | [ESC/q] Exit'
      return { line1, line2 }
    } else if (view === 'main' && focusedPanel === 'remotes') {
      const line1 = `${globalCommands} | [ENTER] Fetch`
      const line2 = '[n] Add Remote | [e] Edit | [D] Delete | [TAB/Shift+TAB] Panels | [ESC/q] Exit'
      return { line1, line2 }
    } else if (view === 'main' && focusedPanel === 'tags') {
      const line1 = `${globalCommands} | [ENTER] Checkout | [i] View Details`
      const line2 = '[n] Create Tag | [t] Tag at HEAD | [D] Delete | [P] Push | [←/→] Switch Tabs | [TAB/Shift+TAB] Panels | [ESC/q] Exit'
      return { line1, line2 }
    } else if (view === 'log') {
      const line1 = `${globalCommands} | [ENTER] View Diff`
      const line2 = '[y] Cherry-pick | [R] Revert | [X] Reset | [Y] Copy Hash | [t] Tag | [1-5] Switch View | [ESC/q] Exit'
      return { line1, line2 }
    } else if (view === 'stash') {
      const line1 = `${globalCommands} | [s] Create Stash`
      const line2 = '[ENTER] Apply | [P] Pop | [D] Drop | [V] View Diff | [1-5] Switch View | [ESC/q] Exit'
      return { line1, line2 }
    } else if (view === 'remotes') {
      const line1 = `${globalCommands} | [ENTER] Fetch`
      const line2 = '[n] Add Remote | [e] Edit | [D] Delete | [1-5] Switch View | [ESC/q] Exit'
      return { line1, line2 }
    } else if (view === 'diff') {
      const line1 = `${globalCommands} | [1-5] Switch View`
      const line2 = '[ESC/q] Exit'
      return { line1, line2 }
    } else if (view === 'tagDetails') {
      const line1 = `${globalCommands} | [ESC] Back`
      const line2 = '[ENTER] Checkout | [D] Delete | [P] Push'
      return { line1, line2 }
    }
    
    // Fallback
    return {
      line1: globalCommands,
      line2: '[[] Files | []] Branches | [\\] Commits | [TAB/Shift+TAB] Panels | [ESC/q] Exit',
    }
  }

  const { line1, line2 } = getContextualCommands()

  return (
    <box
      width="100%"
      height={4}
      borderStyle={theme.borders.style}
      borderColor={theme.colors.border}
      padding={theme.spacing.none}
      flexDirection="column"
    >
      <box paddingLeft={theme.spacing.xs} paddingTop={theme.spacing.none}>
        <text fg={theme.colors.text.muted}>{line1}</text>
      </box>
      <box paddingLeft={theme.spacing.xs} paddingTop={theme.spacing.none}>
        <text fg={theme.colors.text.muted}>{line2}</text>
      </box>
    </box>
  )
}
