# GitArbor TUI - Product Roadmap

This roadmap outlines essential features to evolve GitArbor from an MVP to a production-ready terminal Git client.

## Current State (MVP)

GitArbor currently provides:
- Basic status, commit, and branch viewing
- File staging/unstaging
- Commit creation (single-line messages)
- Branch switching
- Diff viewing (first 100 lines)
- File system watching for auto-refresh
- Command palette and settings modal

## Roadmap Phases

### Phase 1: Core Git Operations (High Priority)

Essential features that users expect from any Git client.

#### 1.1 Push/Pull/Fetch Operations
**Priority: Critical**
- Implement `git push` with progress indication
- Implement `git pull` with merge handling
- Implement `git fetch` for updating remote refs
- Add keyboard shortcuts (e.g., `p` for push, `f` for fetch)
- Display push/pull status and remote sync info
- Handle authentication (SSH keys, credential helpers)
- Show progress bars for network operations

#### 1.2 Multi-line Commit Messages
**Priority: High**
- Support full commit message editor (subject + body)
- Allow multi-line input in commit modal
- Show character count for subject line (50 char convention)
- Support blank line between subject and body
- Preview formatted commit message

#### 1.3 Stash Management
**Priority: High**
- List all stashes with descriptions
- Create new stash with optional message
- Apply/pop stashes
- Drop stashes
- View stash diffs
- Dedicated stash view panel

#### 1.4 File Operations
**Priority: High**
- Discard changes to unstaged files
- Delete untracked files
- Stage/unstage all files at once
- Rename/move files through git
- Show confirmation modals for destructive operations

### Phase 2: Enhanced Diff & Staging (High Priority)

Advanced features for reviewing and staging changes.

#### 2.1 Interactive Staging (Hunk Staging)
**Priority: High**
- Parse diff output into hunks
- Allow staging/unstaging individual hunks
- Support split hunks for fine-grained control
- Visual hunk selection interface
- Stage/unstage lines within hunks

#### 2.2 Improved Diff Viewer
**Priority: Medium**
- Remove 100-line limit with scrolling support
- Add syntax highlighting for code diffs
- Side-by-side diff view option
- Show binary file indicators
- Display file mode changes
- Add word-level diff highlighting

#### 2.3 Diff Navigation
**Priority: Medium**
- Jump to next/previous hunk (n/N keys)
- Jump to next/previous file
- Collapse/expand hunks
- Search within diff
- Navigate to specific line numbers

### Phase 3: Branch & Merge Operations (High Priority)

Complete branch management and merge workflows.

#### 3.1 Branch Management
**Priority: High**
- Create new branches from current HEAD
- Create branches from specific commits
- Delete local branches (with safety checks)
- Delete remote branches
- Rename branches
- Set upstream tracking branches
- Show branch creation/modification dates
- Display branch descriptions

#### 3.2 Merge Operations
**Priority: Critical**
- Merge branches with conflict detection
- Fast-forward vs. no-fast-forward options
- Merge conflict resolution interface
- Show conflicted files with conflict markers
- Edit conflicts inline (3-way merge view)
- Stage resolved conflicts
- Abort merge operation
- Merge commit message editor

#### 3.3 Rebase Operations
**Priority: Medium**
- Interactive rebase UI
- Pick/squash/fixup/edit/drop commits
- Reorder commits via keyboard
- Rebase onto different branches
- Continue/skip/abort rebase operations
- Handle rebase conflicts

### Phase 4: History & Navigation (Medium Priority)

Enhanced commit history exploration and navigation.

#### 4.1 Commit Log Enhancements
**Priority: Medium**
- Remove 50-commit limit with pagination/infinite scroll
- Show commit graph visualization (branches/merges)
- Filter commits by author/date/message
- Search commit messages and diffs
- Show commit tags and references
- Display commit stats (files changed, insertions/deletions)
- View full commit details modal

#### 4.2 Commit Operations
**Priority: Medium**
- Cherry-pick commits
- Revert commits
- Amend last commit
- Reset to specific commit (soft/mixed/hard)
- Show commit in diff view
- Copy commit hash to clipboard
- Create tags from commits

#### 4.3 File History
**Priority: Low**
- View history for specific file
- Show file at specific commit
- Blame view showing line-by-line authorship
- Follow file renames across history

### Phase 5: Remote & Collaboration (Medium Priority)

Features for working with remote repositories and teams.

#### 5.1 Remote Management
**Priority: Medium**
- List all configured remotes
- Add/remove remotes
- Edit remote URLs
- Fetch from specific remotes
- Push/pull from specific remotes
- Show remote branch tracking

#### 5.2 Pull Request Integration
**Priority: Low**
- View pull requests (GitHub/GitLab/Bitbucket)
- Create pull requests from branches
- Show PR status and checks
- Requires API integration (separate from core git)

### Phase 6: Performance & UX (Medium Priority)

Optimizations and quality-of-life improvements.

#### 6.1 Performance Improvements
**Priority: Medium**
- Cache git operations where possible
- Implement virtual scrolling for large lists
- Lazy load commit history
- Debounce file system watching
- Background git operations
- Cancel in-progress operations

#### 6.2 Search & Filter
**Priority: Medium**
- Fuzzy search for files in status
- Filter branches by name/pattern
- Search commit messages and content
- Quick file navigation (Ctrl+P style)
- Regular expression support

#### 6.3 Configuration & Customization
**Priority: Low**
- Custom color themes (light/dark presets)
- Configurable keyboard shortcuts
- Save window layout preferences
- Per-repository settings
- Global config file (~/.gitarborrc)
- Font size adjustments

### Phase 7: Advanced Features (Low Priority)

Power-user features and advanced workflows.

#### 7.1 Submodule Support
**Priority: Low**
- List submodules
- Initialize/update submodules
- Show submodule status
- Navigate into submodules

#### 7.2 Worktree Management
**Priority: Low**
- List worktrees
- Add/remove worktrees
- Switch between worktrees

#### 7.3 Advanced Git Operations
**Priority: Low**
- Reflog viewer
- Bisect operations for bug hunting
- Bundle creation/extraction
- Garbage collection and maintenance
- Shallow clone management

### Phase 8: Multi-Repository & Workspace (Low Priority)

Managing multiple repositories simultaneously.

#### 8.1 Multiple Repositories
**Priority: Low**
- Open multiple repositories in tabs/panels
- Repository switcher
- Cross-repository operations
- Saved workspace sessions
- Monitor multiple repos simultaneously

## Implementation Priorities

### Must Have (Phase 1-3)
These features are essential for GitArbor to be considered production-ready:
1. Push/Pull/Fetch operations
2. Merge conflict resolution
3. Interactive staging (hunks)
4. Stash management
5. File discard operations
6. Branch creation/deletion
7. Multi-line commit messages

### Should Have (Phase 4-5)
Important features that significantly enhance usability:
1. Improved diff viewer (no limits, syntax highlighting)
2. Commit graph visualization
3. Cherry-pick and revert
4. Remote management
5. Performance optimizations
6. Search and filter capabilities

### Nice to Have (Phase 6-8)
Features that provide additional value for power users:
1. Custom themes and shortcuts
2. Submodule support
3. Pull request integration
4. Worktree management
5. Multi-repository support
6. Reflog and advanced git operations

## Testing Strategy

As features are implemented, establish a testing framework:
- Unit tests for GitClient operations using Bun's test runner
- Integration tests for git workflows
- E2E tests for keyboard navigation and UI
- Performance benchmarks for large repositories

## Documentation Needs

- User guide with all keyboard shortcuts
- Workflow tutorials (merge conflicts, rebasing, etc.)
- Configuration file documentation
- Contributing guidelines for developers
- Architecture documentation

## Success Metrics

Track these metrics to measure GitArbor's maturity:
1. Feature parity with lazygit/tig (popular TUI git clients)
2. Performance benchmarks (large repos, slow connections)
3. User adoption and feedback
4. Bug reports and resolution time
5. Community contributions

## Version Milestones

- **v0.1.0** (Current): MVP with basic status, commit, branch operations
- **v0.2.0**: Add push/pull, stash, file operations (Phase 1)
- **v0.3.0**: Interactive staging and improved diff viewer (Phase 2)
- **v0.4.0**: Branch management and merge operations (Phase 3)
- **v0.5.0**: Enhanced history and commit operations (Phase 4)
- **v1.0.0**: Production-ready with all critical features, testing, and documentation

---

**Last Updated**: January 2026
**Status**: Active Development
