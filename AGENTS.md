# Agent Guidelines for GitArbor TUI

This document provides coding standards and guidelines for AI agents working on GitArbor TUI, a terminal-based Git client built with OpenTUI and React.

## Project Overview

GitArbor is a TUI Git client built with:
- **Runtime**: Bun (v1.3.6+)
- **UI Framework**: OpenTUI (@opentui/core, @opentui/react v0.1.74)
- **Language**: TypeScript (strict mode)
- **React**: v19.2.3

## Build, Run & Test Commands

### Running the Application
```bash
bun run start          # Start the application
bun run dev            # Start in dev mode (same as start)
bun run index.tsx      # Direct execution
```

### Package Management
```bash
bun install            # Install dependencies
bun add <package>      # Add dependency
bun add -d <package>   # Add dev dependency
```

### Type Checking
```bash
bun --bun tsc --noEmit # Check types without emitting files
```

**Note**: This project currently has no test suite. Tests should use Bun's built-in test runner when implemented.

## TypeScript Configuration

### Strict Type Safety
- **Strict mode enabled**: All strict flags are on
- **No unchecked indexed access**: Always check array/object access
- **No implicit overrides**: Explicitly mark overridden methods
- **No fallthrough cases**: All switch cases must break/return
- **Module resolution**: `bundler` mode (Bun-specific)
- **JSX**: `react-jsx` with `@opentui/react` as import source

### Type Imports
Always use `type` imports for types:
```typescript
import type { GitStatus, GitFile } from '../types/git'
import { GitClient } from './utils/git'  // Runtime import
```

## Code Style Guidelines

### File Organization

#### Directory Structure
```
src/
├── App.tsx              # Main app component with state & keyboard handlers
├── theme.ts             # Theme configuration and design tokens
├── types/               # TypeScript type definitions
│   ├── git.ts          # Git-related interfaces
│   └── commands.ts     # Command palette types
├── utils/              # Utility functions & classes
│   └── git.ts          # GitClient class (git operations)
└── components/         # React components
    ├── Header.tsx
    ├── Footer.tsx
    ├── MainView.tsx
    ├── StatusView.tsx
    ├── LogView.tsx
    ├── BranchesView.tsx
    ├── DiffView.tsx
    ├── CommitModal.tsx
    ├── ExitModal.tsx
    ├── CommandPalette.tsx
    └── SettingsModal.tsx
```

### Import Order
1. External dependencies (React, OpenTUI)
2. Theme (if needed)
3. Internal utils/classes
4. Components
5. Type imports (always with `type` keyword)

Example:
```typescript
import { useState, useEffect, useCallback } from 'react'
import { useKeyboard, useRenderer } from '@opentui/react'
import { theme } from './theme'
import { GitClient } from './utils/git'
import { Header } from './components/Header'
import type { GitStatus, GitCommit, View } from './types/git'
```

### Naming Conventions

#### Variables & Functions
- **camelCase** for variables and functions
- **PascalCase** for components and classes
- **UPPER_CASE** for constants (if any)

#### Component Props
- Use descriptive interface names ending with `Props`:
```typescript
interface HeaderProps {
  branch: string
  ahead: number
  behind: number
  view: string
}
```

#### Handlers
- Prefix event handlers with `handle`:
```typescript
const handleStage = useCallback(async (path: string) => { ... }, [])
const handleCommit = useCallback(async (msg: string) => { ... }, [])
```

### Component Structure

#### Functional Components
All components are functional with hooks:
```typescript
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks (useState, useEffect, useCallback, etc.)
  const [state, setState] = useState(...)
  
  // 2. Helper functions
  const helperFn = useCallback(() => { ... }, [deps])
  
  // 3. Effects
  useEffect(() => { ... }, [deps])
  
  // 4. JSX return
  return (
    <box>...</box>
  )
}
```

#### OpenTUI JSX Elements
Use OpenTUI's primitive components:
- `<box>` - Container with flexbox layout
- `<text>` - Text rendering with color support

Common props:
```typescript
<box
  width="100%"           // Size: string or number
  height={3}
  flexDirection="row"    // or "column" (default)
  flexGrow={1}
  borderStyle="single"   // Border style
  borderColor="#555555"  // Hex colors
  padding={0}
  paddingLeft={1}
>
  <text fg="#FFFFFF">Text content</text>
</box>
```

### Theme System

**IMPORTANT**: Always use design tokens from `src/theme.ts` for colors, spacing, and borders. Never hardcode style values.

#### Using the Theme
Import and use theme tokens in all components:
```typescript
import { theme } from '../theme'

// Colors
<text fg={theme.colors.primary}>Highlighted</text>
<text fg={theme.colors.text.muted}>Muted text</text>
<text fg={theme.colors.git.staged}>Staged file</text>
<box borderColor={theme.colors.border}>...</box>

// Spacing
<box padding={theme.spacing.none}>...</box>
<box paddingLeft={theme.spacing.xs}>...</box>

// Borders
<box borderStyle={theme.borders.style}>...</box>
```

#### Available Theme Tokens

**Colors:**
- `theme.colors.primary` - Primary accent (#CC8844 orange)
- `theme.colors.primaryDark` - Darker accent (#BB7733)
- `theme.colors.border` - Unfocused borders (#555555)
- `theme.colors.borderFocused` - Focused borders (#CC8844)
- `theme.colors.text.primary` - Main text (#FFFFFF)
- `theme.colors.text.secondary` - Secondary text (#CCCCCC)
- `theme.colors.text.muted` - Muted/disabled text (#999999)
- `theme.colors.git.staged` - Staged files (#00FF00 green)
- `theme.colors.git.modified` - Modified files (#FFFF00 yellow)
- `theme.colors.git.untracked` - Untracked files (#CCCCCC)
- `theme.colors.git.deleted` - Deleted files/lines (#FF0000 red)
- `theme.colors.git.added` - Added lines (#00FF00 green)
- `theme.colors.status.success` - Success messages (#00FF00)
- `theme.colors.status.error` - Error messages (#FF0000)
- `theme.colors.status.warning` - Warnings (#FFFF00)
- `theme.colors.status.info` - Info messages (#00FFFF)

**Spacing:**
- `theme.spacing.none` - 0
- `theme.spacing.xs` - 1
- `theme.spacing.sm` - 2
- `theme.spacing.md` - 3
- `theme.spacing.lg` - 4
- `theme.spacing.xl` - 5

**Borders:**
- `theme.borders.style` - 'single'

#### Why Use Theme Tokens?
- Enables future theme switching (light/dark modes, custom themes)
- Maintains consistency across the application
- Easier to update colors/spacing globally
- Self-documenting code (semantic names vs hex codes)

### Async/Await & Promises

#### Always handle errors
```typescript
try {
  const result = await git.getStatus()
  setStatus(result)
  setMessage('Success')
} catch (error) {
  setMessage(`Error: ${error}`)
}
```

#### Void async calls in effects
```typescript
useEffect(() => {
  void loadData()  // Don't await in effect
}, [loadData])
```

#### Promisify child_process
```typescript
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
```

### Error Handling

#### Descriptive error messages
```typescript
throw new Error(`Failed to stage file: ${error}`)
```

#### Git command error handling
- Wrap all git operations in try-catch
- Display user-friendly messages in Footer
- Silently handle expected failures (e.g., no upstream branch)

```typescript
try {
  const { stdout } = await execAsync('git ...', { cwd: this.cwd })
} catch {
  // No upstream branch - this is OK
}
```

### State Management

#### Centralized in App.tsx
All application state lives in `App.tsx`:
```typescript
const [view, setView] = useState<View>('main')
const [status, setStatus] = useState<GitStatus>({ ... })
const [selectedIndex, setSelectedIndex] = useState(0)
const [message, setMessage] = useState('')
```

#### Props flow down
Components receive data and callbacks via props - no global state.

### Git Operations

#### GitClient class pattern
All git commands go through the `GitClient` class:
```typescript
export class GitClient {
  constructor(private cwd: string) {}
  
  async getStatus(): Promise<GitStatus> { ... }
  async stageFile(path: string): Promise<void> { ... }
}
```

#### Command execution
```typescript
const { stdout } = await execAsync('git command', { cwd: this.cwd })
```

#### Escape user input
```typescript
await execAsync(`git add "${path}"`, { cwd: this.cwd })
message.replace(/"/g, '\\"')  // Escape quotes in commit messages
```

## Architecture Patterns

### View System
- `view` state controls main view: `'main' | 'log' | 'diff'`
- `focusedPanel` controls focus in main view: `'status' | 'branches' | 'log'`

### Keyboard Handling
- Centralized in `App.tsx` via `useKeyboard` hook
- Check modal state before handling keys
- Modals handle their own keyboard input

### Modal Pattern
```typescript
const [showModal, setShowModal] = useState(false)

// In keyboard handler
if (showModal) {
  return  // Modal handles its own keys
}

// In JSX
{showModal && (
  <Modal onClose={() => setShowModal(false)} />
)}
```

## Common Patterns

### Array operations with type safety
```typescript
// Non-null assertions when filtering guarantees presence
const [hash, shortHash] = line.split('\x00')
return { hash: hash!, shortHash: shortHash! }
```

### Ternary for conditional rendering
```typescript
const aheadBehind = ahead > 0 || behind > 0
  ? ` [↑${ahead} ↓${behind}]`
  : ''
```

### Map with unique keys
```typescript
{files.map((file, idx) => (
  <box key={file.path}>...</box>  // Use unique identifier
))}
```

## Don'ts

- ❌ Don't use classes for components (use functional components)
- ❌ Don't use default exports (use named exports)
- ❌ Don't use console.log (display messages via Footer)
- ❌ Don't use inline styles (OpenTUI uses props)
- ❌ Don't use CSS or CSS-in-JS (OpenTUI styling only)
- ❌ Don't ignore TypeScript errors (strict mode enforced)
- ❌ Don't use `any` type (use proper types or `unknown`)
- ❌ Don't create test files yet (no test infrastructure)

## Additional Notes

- Entry point has `@ts-nocheck` for global type augmentation only
- Use alternate screen mode for fullscreen TUI experience
- Handle cleanup on SIGINT/SIGTERM for clean exits
- All components are presentational except App.tsx
