/**
 * Theme configuration for GitArbor TUI
 * 
 * This file contains all design tokens (colors, spacing, borders) used throughout the application.
 * Always import and use these tokens instead of hardcoding values to support theming.
 */

export interface Theme {
  colors: {
    primary: string
    primaryDark: string
    border: string
    borderFocused: string
    background: {
      primary: string
      modal: string
      button: string
      buttonHover: string
    }
    text: {
      primary: string
      secondary: string
      muted: string
      disabled: string
      inverted: string
    }
    git: {
      staged: string
      modified: string
      untracked: string
      deleted: string
      added: string
    }
    status: {
      success: string
      error: string
      warning: string
      info: string
    }
  }
  spacing: {
    none: number
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
  }
  borders: {
    style: 'single'
  }
}

/**
 * Default theme (can be extended with multiple themes later)
 */
export const defaultTheme: Theme = {
  colors: {
    primary: '#CC8844',        // Orange - focus/selected elements
    primaryDark: '#BB7733',    // Darker orange - secondary highlights
    border: '#555555',         // Gray - unfocused borders
    borderFocused: '#CC8844',  // Orange - focused borders
    background: {
      primary: '#000000',      // Black - main background
      modal: '#1a1a1a',        // Dark gray - modal background
      button: '#2a2520',       // Dark brown - button background
      buttonHover: '#333333',  // Lighter gray - button hover
    },
    text: {
      primary: '#FFFFFF',      // White - main text
      secondary: '#CCCCCC',    // Light gray - secondary text
      muted: '#999999',        // Gray - muted/disabled text
      disabled: '#666666',     // Darker gray - disabled text
      inverted: '#000000',     // Black - inverted text (on bright bg)
    },
    git: {
      staged: '#00FF00',       // Green - staged files
      modified: '#FFFF00',     // Yellow - modified/unstaged files
      untracked: '#CCCCCC',    // Light gray - untracked files
      deleted: '#FF0000',      // Red - deleted files
      added: '#00FF00',        // Green - added lines in diff
    },
    status: {
      success: '#00FF00',      // Green - success messages
      error: '#FF0000',        // Red - error messages
      warning: '#FFFF00',      // Yellow - warnings
      info: '#00FFFF',         // Cyan - info messages
    },
  },
  spacing: {
    none: 0,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  },
  borders: {
    style: 'single',
  },
}

/**
 * Active theme - modify this to switch themes globally
 */
export const theme = defaultTheme
