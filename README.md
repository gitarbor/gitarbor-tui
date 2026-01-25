# GitArbor TUI

A functional Git client built as a Terminal User Interface (TUI) using OpenTUI and React.

## Features

- **Status View**: View and manage staged, unstaged, and untracked files
- **Commit History**: Browse commit log with author, date, and message information
- **Branch Management**: View local and remote branches, switch between them
- **Diff Viewer**: See file changes in a color-coded diff view
- **Keyboard Navigation**: Full keyboard-driven interface
- **Git Operations**: Stage/unstage files, create commits, switch branches
- **Multi-line Commits**: Support for commit subject and body with character count guidance
- **Commit Preview**: Preview formatted commit messages before submitting

## Installation

This project uses [Bun](https://bun.sh/) as the JavaScript runtime.

```bash
# Install dependencies
bun install
```

## Usage

Run GitArbor in any git repository:

```bash
# From the GitArbor project directory
bun run start

# Or run directly
bun run index.tsx
```

## Keyboard Shortcuts

### View Navigation
- `1` - Switch to Status view
- `2` - Switch to Log (commit history) view
- `3` - Switch to Branches view
- `4` - Switch to Diff view

### Navigation
- `↑` / `↓` - Navigate up/down through lists
- `Enter` - Execute action (e.g., checkout branch)

### Git Operations
- `s` - Stage selected file (Status view)
- `u` - Unstage selected file (Status view)
- `c` - Create commit (opens commit modal)
- `q` - Quit application

### Commit Modal
- `Tab` - Switch between subject and body fields
- `Ctrl+Enter` or `Ctrl+S` - Submit commit
- `Ctrl+P` - Toggle commit message preview
- `Esc` - Cancel commit

## Project Structure

```
gitarbor-tui/
├── index.tsx              # Main entry point
├── src/
│   ├── App.tsx           # Main application component
│   ├── types/
│   │   └── git.ts        # TypeScript interfaces
│   ├── utils/
│   │   └── git.ts        # Git operations (GitClient class)
│   └── components/
│       ├── Header.tsx    # Top header with branch info
│       ├── Footer.tsx    # Bottom footer with commands
│       ├── StatusView.tsx    # File status display
│       ├── LogView.tsx       # Commit history display
│       ├── BranchesView.tsx  # Branch list display
│       ├── DiffView.tsx      # Diff viewer
│       └── CommitModal.tsx   # Commit message input
├── package.json
└── tsconfig.json
```

## Architecture

### Components

- **App.tsx**: Main application orchestrator that manages state, keyboard input, and view switching
- **Header**: Displays current branch, ahead/behind counts, and active view
- **Footer**: Shows available keyboard shortcuts and status messages
- **StatusView**: Lists files grouped by status (staged, unstaged, untracked)
- **LogView**: Displays commit history with hash, author, date, and message
- **BranchesView**: Lists local and remote branches, indicates current branch
- **DiffView**: Shows color-coded diff output for selected files
- **CommitModal**: Modal dialog for entering multi-line commit messages with subject and body fields

### Git Operations

The `GitClient` class in `src/utils/git.ts` handles all Git operations by executing git commands via child_process:

- `getStatus()` - Get repository status
- `getLog()` - Get commit history
- `getBranches()` - List branches
- `stageFile()` - Stage a file
- `unstageFile()` - Unstage a file
- `commit()` - Create a commit
- `checkout()` - Switch branches
- `getDiff()` - Get unstaged diff
- `getStagedDiff()` - Get staged diff

## Color Scheme

GitArbor uses a consistent color scheme for better readability:

- **Primary (focus)**: `#CC8844` (orange)
- **Secondary**: `#BB7733` (darker orange)
- **Borders**: `#555555` (gray)
- **Muted text**: `#999999` (light gray)
- **Success/Staged**: `#00FF00` (green)
- **Modified/Unstaged**: `#FFFF00` (yellow)
- **Info**: `#00FFFF` (cyan)
- **Deletions**: `#FF0000` (red)
- **Additions**: `#00FF00` (green)

## Development

The application uses:
- **OpenTUI**: Terminal UI framework with React support
- **React**: For component-based UI structure and state management
- **Bun**: Fast JavaScript runtime and package manager
- **TypeScript**: Type-safe development

## Error Handling

All git operations include try-catch error handling. Errors are displayed in the footer message area with descriptive error messages.

## Limitations (MVP)

This is an MVP with the following limitations:

- Diff view shows first 100 lines only
- Commit log limited to 50 commits
- No merge conflict resolution
- No interactive rebase
- No stash management

## Future Enhancements

Potential features for future versions:
- Git push/pull operations
- Merge conflict resolution
- Interactive staging (stage hunks)
- Stash management
- Search/filter functionality
- Configuration file support
- Multiple repository management
- Git history graph visualization

---

This project was created using `bun init` in bun v1.3.6. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
