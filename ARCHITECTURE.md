# GitArbor Component Architecture

## Component Hierarchy

```
index.tsx (Entry Point)
  └── App.tsx (Main Application Controller)
      ├── Header
      │   └── Displays: Branch name, ahead/behind counts, current view
      │
      ├── View Components (one active at a time)
      │   ├── StatusView (1)
      │   │   └── Lists: Staged, unstaged, untracked files
      │   │
      │   ├── LogView (2)
      │   │   └── Lists: Commit history with metadata
      │   │
      │   ├── BranchesView (3)
      │   │   └── Lists: Local and remote branches
      │   │
      │   └── DiffView (4)
      │       └── Shows: Color-coded diff output
      │
      ├── Footer
      │   └── Displays: Keyboard shortcuts, status messages
      │
      └── CommitModal (conditional)
          └── Modal: Commit message input
```

## Data Flow

```
User Input (Keyboard)
  ↓
useKeyboard Hook (App.tsx)
  ↓
State Updates (useState)
  ↓
GitClient Operations (src/utils/git.ts)
  ↓
Git Commands (child_process exec)
  ↓
State Refresh
  ↓
Component Re-render
```

## State Management

All state is managed in `App.tsx` using React hooks:
- `view` - Current active view
- `status` - Git status (staged, unstaged, untracked files)
- `commits` - Commit history
- `branches` - Branch list
- `diff` - Diff content
- `selectedIndex` - Currently selected item in lists
- `message` - Status/error message to display
- `showCommitModal` - Modal visibility
- `loading` - Loading state

## Git Operations

All git operations are abstracted in the `GitClient` class:
- Executes git commands via `child_process.exec`
- Returns typed data structures
- Handles errors with descriptive messages
- Async operations using Promises

## Keyboard Handling

Centralized in `App.tsx` using `useKeyboard` hook:
- View switching: 1-4 keys
- Navigation: Arrow keys
- Actions: s (stage), u (unstage), c (commit), q (quit)
- Modal handling: Enter (submit), Esc (cancel)
