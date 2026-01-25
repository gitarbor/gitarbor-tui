/**
 * Theme configuration for GitArbor TUI
 * 
 * This file contains all design tokens (colors, spacing, borders) used throughout the application.
 * Always import and use these tokens instead of hardcoding values to support theming.
 */

export interface Theme {
  name: string
  description: string
  colors: {
    primary: string
    primaryDark: string
    border: string
    borderFocused: string
    background: {
      primary: string
      secondary: string
      highlight: string
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
 * Default Dark Theme - Classic dark terminal look
 */
const defaultDarkTheme: Theme = {
  name: 'Default Dark',
  description: 'Classic dark theme with orange accents',
  colors: {
    primary: '#CC8844',        // Orange - focus/selected elements
    primaryDark: '#BB7733',    // Darker orange - secondary highlights
    border: '#555555',         // Gray - unfocused borders
    borderFocused: '#CC8844',  // Orange - focused borders
    background: {
      primary: '#000000',      // Black - main background
      secondary: '#1a1a1a',    // Dark gray - secondary background (tabs, panels)
      highlight: '#2a2520',    // Dark brown - highlighted background
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
 * Light Theme - Clean light terminal look
 */
const lightTheme: Theme = {
  name: 'Light',
  description: 'Clean light theme for bright environments',
  colors: {
    primary: '#0066CC',        // Blue - focus/selected elements
    primaryDark: '#004499',    // Darker blue - secondary highlights
    border: '#CCCCCC',         // Light gray - unfocused borders
    borderFocused: '#0066CC',  // Blue - focused borders
    background: {
      primary: '#FFFFFF',      // White - main background
      secondary: '#F5F5F5',    // Light gray - secondary background
      highlight: '#E0E0E0',    // Gray - highlighted background
      modal: '#F5F5F5',        // Light gray - modal background
      button: '#E0E0E0',       // Gray - button background
      buttonHover: '#D0D0D0',  // Darker gray - button hover
    },
    text: {
      primary: '#000000',      // Black - main text
      secondary: '#333333',    // Dark gray - secondary text
      muted: '#666666',        // Gray - muted/disabled text
      disabled: '#999999',     // Light gray - disabled text
      inverted: '#FFFFFF',     // White - inverted text (on dark bg)
    },
    git: {
      staged: '#00AA00',       // Green - staged files
      modified: '#CC8800',     // Orange - modified/unstaged files
      untracked: '#666666',    // Gray - untracked files
      deleted: '#CC0000',      // Red - deleted files
      added: '#00AA00',        // Green - added lines in diff
    },
    status: {
      success: '#00AA00',      // Green - success messages
      error: '#CC0000',        // Red - error messages
      warning: '#CC8800',      // Orange - warnings
      info: '#0066CC',         // Blue - info messages
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
 * Monokai Theme - Popular dark theme inspired by Monokai
 */
const monokaiTheme: Theme = {
  name: 'Monokai',
  description: 'Dark theme inspired by the Monokai color scheme',
  colors: {
    primary: '#F92672',        // Pink - focus/selected elements
    primaryDark: '#E61E63',    // Darker pink - secondary highlights
    border: '#49483E',         // Dark gray - unfocused borders
    borderFocused: '#F92672',  // Pink - focused borders
    background: {
      primary: '#272822',      // Dark background
      secondary: '#1E1F1C',    // Darker gray - secondary background
      highlight: '#3E3D32',    // Brown-gray - highlighted background
      modal: '#1E1F1C',        // Darker gray - modal background
      button: '#3E3D32',       // Brown-gray - button background
      buttonHover: '#49483E',  // Lighter gray - button hover
    },
    text: {
      primary: '#F8F8F2',      // Off-white - main text
      secondary: '#CFCFC2',    // Light gray - secondary text
      muted: '#75715E',        // Gray - muted/disabled text
      disabled: '#49483E',     // Dark gray - disabled text
      inverted: '#272822',     // Dark - inverted text (on bright bg)
    },
    git: {
      staged: '#A6E22E',       // Green - staged files
      modified: '#E6DB74',     // Yellow - modified/unstaged files
      untracked: '#75715E',    // Gray - untracked files
      deleted: '#F92672',      // Pink - deleted files
      added: '#A6E22E',        // Green - added lines in diff
    },
    status: {
      success: '#A6E22E',      // Green - success messages
      error: '#F92672',        // Pink - error messages
      warning: '#E6DB74',      // Yellow - warnings
      info: '#66D9EF',         // Cyan - info messages
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
 * Nord Theme - Arctic, north-bluish color palette
 */
const nordTheme: Theme = {
  name: 'Nord',
  description: 'Arctic, north-bluish color palette',
  colors: {
    primary: '#88C0D0',        // Frost blue - focus/selected elements
    primaryDark: '#81A1C1',    // Darker frost blue - secondary highlights
    border: '#4C566A',         // Polar night gray - unfocused borders
    borderFocused: '#88C0D0',  // Frost blue - focused borders
    background: {
      primary: '#2E3440',      // Polar night - main background
      secondary: '#242933',    // Darker polar night - secondary background
      highlight: '#3B4252',    // Polar night gray - highlighted background
      modal: '#242933',        // Darker polar night - modal background
      button: '#3B4252',       // Polar night gray - button background
      buttonHover: '#434C5E',  // Lighter polar night - button hover
    },
    text: {
      primary: '#ECEFF4',      // Snow storm - main text
      secondary: '#D8DEE9',    // Snow storm gray - secondary text
      muted: '#81A1C1',        // Frost blue - muted/disabled text
      disabled: '#4C566A',     // Polar night gray - disabled text
      inverted: '#2E3440',     // Dark - inverted text (on bright bg)
    },
    git: {
      staged: '#A3BE8C',       // Aurora green - staged files
      modified: '#EBCB8B',     // Aurora yellow - modified/unstaged files
      untracked: '#81A1C1',    // Frost blue - untracked files
      deleted: '#BF616A',      // Aurora red - deleted files
      added: '#A3BE8C',        // Aurora green - added lines in diff
    },
    status: {
      success: '#A3BE8C',      // Aurora green - success messages
      error: '#BF616A',        // Aurora red - error messages
      warning: '#EBCB8B',      // Aurora yellow - warnings
      info: '#88C0D0',         // Frost blue - info messages
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
 * Solarized Dark Theme - Popular precision color scheme
 */
const solarizedDarkTheme: Theme = {
  name: 'Solarized Dark',
  description: 'Precision color scheme for the terminal',
  colors: {
    primary: '#268BD2',        // Blue - focus/selected elements
    primaryDark: '#2075B8',    // Darker blue - secondary highlights
    border: '#586E75',         // Base01 - unfocused borders
    borderFocused: '#268BD2',  // Blue - focused borders
    background: {
      primary: '#002B36',      // Base03 - main background
      secondary: '#073642',    // Base02 - secondary background
      highlight: '#586E75',    // Base01 - highlighted background
      modal: '#073642',        // Base02 - modal background
      button: '#073642',       // Base02 - button background
      buttonHover: '#586E75',  // Base01 - button hover
    },
    text: {
      primary: '#EEE8D5',      // Base2 - main text
      secondary: '#93A1A1',    // Base1 - secondary text
      muted: '#657B83',        // Base00 - muted/disabled text
      disabled: '#586E75',     // Base01 - disabled text
      inverted: '#002B36',     // Base03 - inverted text (on bright bg)
    },
    git: {
      staged: '#859900',       // Green - staged files
      modified: '#B58900',     // Yellow - modified/unstaged files
      untracked: '#93A1A1',    // Base1 - untracked files
      deleted: '#DC322F',      // Red - deleted files
      added: '#859900',        // Green - added lines in diff
    },
    status: {
      success: '#859900',      // Green - success messages
      error: '#DC322F',        // Red - error messages
      warning: '#B58900',      // Yellow - warnings
      info: '#2AA198',         // Cyan - info messages
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
 * Solarized Light Theme - Light variant of Solarized
 */
const solarizedLightTheme: Theme = {
  name: 'Solarized Light',
  description: 'Light variant of Solarized color scheme',
  colors: {
    primary: '#268BD2',        // Blue - focus/selected elements
    primaryDark: '#2075B8',    // Darker blue - secondary highlights
    border: '#93A1A1',         // Base1 - unfocused borders
    borderFocused: '#268BD2',  // Blue - focused borders
    background: {
      primary: '#FDF6E3',      // Base3 - main background
      secondary: '#EEE8D5',    // Base2 - secondary background
      highlight: '#93A1A1',    // Base1 - highlighted background
      modal: '#EEE8D5',        // Base2 - modal background
      button: '#EEE8D5',       // Base2 - button background
      buttonHover: '#93A1A1',  // Base1 - button hover
    },
    text: {
      primary: '#002B36',      // Base03 - main text
      secondary: '#586E75',    // Base01 - secondary text
      muted: '#839496',        // Base0 - muted/disabled text
      disabled: '#93A1A1',     // Base1 - disabled text
      inverted: '#FDF6E3',     // Base3 - inverted text (on dark bg)
    },
    git: {
      staged: '#859900',       // Green - staged files
      modified: '#B58900',     // Yellow - modified/unstaged files
      untracked: '#586E75',    // Base01 - untracked files
      deleted: '#DC322F',      // Red - deleted files
      added: '#859900',        // Green - added lines in diff
    },
    status: {
      success: '#859900',      // Green - success messages
      error: '#DC322F',        // Red - error messages
      warning: '#B58900',      // Yellow - warnings
      info: '#2AA198',         // Cyan - info messages
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
 * Gruvbox Dark Theme - Retro groove color scheme
 */
const gruvboxDarkTheme: Theme = {
  name: 'Gruvbox Dark',
  description: 'Retro groove color scheme with warm palette',
  colors: {
    primary: '#FE8019',        // Orange - focus/selected elements
    primaryDark: '#D65D0E',    // Darker orange - secondary highlights
    border: '#504945',         // Dark gray - unfocused borders
    borderFocused: '#FE8019',  // Orange - focused borders
    background: {
      primary: '#282828',      // Dark background
      secondary: '#1D2021',    // Darker background - secondary background
      highlight: '#3C3836',    // Dark gray - highlighted background
      modal: '#1D2021',        // Darker background - modal background
      button: '#3C3836',       // Dark gray - button background
      buttonHover: '#504945',  // Lighter gray - button hover
    },
    text: {
      primary: '#EBDBB2',      // Light beige - main text
      secondary: '#D5C4A1',    // Beige - secondary text
      muted: '#928374',        // Gray - muted/disabled text
      disabled: '#665C54',     // Dark gray - disabled text
      inverted: '#282828',     // Dark - inverted text (on bright bg)
    },
    git: {
      staged: '#B8BB26',       // Green - staged files
      modified: '#FABD2F',     // Yellow - modified/unstaged files
      untracked: '#928374',    // Gray - untracked files
      deleted: '#FB4934',      // Red - deleted files
      added: '#B8BB26',        // Green - added lines in diff
    },
    status: {
      success: '#B8BB26',      // Green - success messages
      error: '#FB4934',        // Red - error messages
      warning: '#FABD2F',      // Yellow - warnings
      info: '#83A598',         // Blue - info messages
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
 * Gruvbox Light Theme - Light variant of Gruvbox
 */
const gruvboxLightTheme: Theme = {
  name: 'Gruvbox Light',
  description: 'Light variant of Gruvbox color scheme',
  colors: {
    primary: '#AF3A03',        // Orange - focus/selected elements
    primaryDark: '#8F3F03',    // Darker orange - secondary highlights
    border: '#D5C4A1',         // Light gray - unfocused borders
    borderFocused: '#AF3A03',  // Orange - focused borders
    background: {
      primary: '#FBF1C7',      // Light background
      secondary: '#F9F5D7',    // Lighter background - secondary background
      highlight: '#EBDBB2',    // Beige - highlighted background
      modal: '#F9F5D7',        // Lighter background - modal background
      button: '#EBDBB2',       // Beige - button background
      buttonHover: '#D5C4A1',  // Darker beige - button hover
    },
    text: {
      primary: '#3C3836',      // Dark gray - main text
      secondary: '#504945',    // Gray - secondary text
      muted: '#928374',        // Gray - muted/disabled text
      disabled: '#BDAE93',     // Light gray - disabled text
      inverted: '#FBF1C7',     // Light - inverted text (on dark bg)
    },
    git: {
      staged: '#79740E',       // Green - staged files
      modified: '#B57614',     // Yellow - modified/unstaged files
      untracked: '#928374',    // Gray - untracked files
      deleted: '#9D0006',      // Red - deleted files
      added: '#79740E',        // Green - added lines in diff
    },
    status: {
      success: '#79740E',      // Green - success messages
      error: '#9D0006',        // Red - error messages
      warning: '#B57614',      // Yellow - warnings
      info: '#076678',         // Blue - info messages
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
 * Dracula Theme - Dark theme with vibrant colors
 */
const draculaTheme: Theme = {
  name: 'Dracula',
  description: 'Dark theme with vibrant purple and pink accents',
  colors: {
    primary: '#BD93F9',        // Purple - focus/selected elements
    primaryDark: '#9580D9',    // Darker purple - secondary highlights
    border: '#44475A',         // Gray - unfocused borders
    borderFocused: '#BD93F9',  // Purple - focused borders
    background: {
      primary: '#282A36',      // Dark background
      secondary: '#1E1F29',    // Darker background - secondary background
      highlight: '#44475A',    // Gray - highlighted background
      modal: '#1E1F29',        // Darker background - modal background
      button: '#44475A',       // Gray - button background
      buttonHover: '#6272A4',  // Lighter gray - button hover
    },
    text: {
      primary: '#F8F8F2',      // White - main text
      secondary: '#F8F8F2',    // White - secondary text
      muted: '#6272A4',        // Gray - muted/disabled text
      disabled: '#44475A',     // Dark gray - disabled text
      inverted: '#282A36',     // Dark - inverted text (on bright bg)
    },
    git: {
      staged: '#50FA7B',       // Green - staged files
      modified: '#F1FA8C',     // Yellow - modified/unstaged files
      untracked: '#8BE9FD',    // Cyan - untracked files
      deleted: '#FF5555',      // Red - deleted files
      added: '#50FA7B',        // Green - added lines in diff
    },
    status: {
      success: '#50FA7B',      // Green - success messages
      error: '#FF5555',        // Red - error messages
      warning: '#F1FA8C',      // Yellow - warnings
      info: '#8BE9FD',         // Cyan - info messages
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
 * Tokyo Night Theme - Clean, dark theme inspired by Tokyo's neon lights
 */
const tokyoNightTheme: Theme = {
  name: 'Tokyo Night',
  description: 'Clean dark theme inspired by Tokyo\'s neon lights',
  colors: {
    primary: '#7AA2F7',        // Blue - focus/selected elements
    primaryDark: '#5E8DD7',    // Darker blue - secondary highlights
    border: '#3B4261',         // Dark gray - unfocused borders
    borderFocused: '#7AA2F7',  // Blue - focused borders
    background: {
      primary: '#1A1B26',      // Dark background
      secondary: '#16161E',    // Darker background - secondary background
      highlight: '#24283B',    // Gray - highlighted background
      modal: '#16161E',        // Darker background - modal background
      button: '#24283B',       // Gray - button background
      buttonHover: '#3B4261',  // Lighter gray - button hover
    },
    text: {
      primary: '#C0CAF5',      // Light blue - main text
      secondary: '#A9B1D6',    // Blue-gray - secondary text
      muted: '#565F89',        // Gray - muted/disabled text
      disabled: '#3B4261',     // Dark gray - disabled text
      inverted: '#1A1B26',     // Dark - inverted text (on bright bg)
    },
    git: {
      staged: '#9ECE6A',       // Green - staged files
      modified: '#E0AF68',     // Yellow - modified/unstaged files
      untracked: '#7DCFFF',    // Cyan - untracked files
      deleted: '#F7768E',      // Red - deleted files
      added: '#9ECE6A',        // Green - added lines in diff
    },
    status: {
      success: '#9ECE6A',      // Green - success messages
      error: '#F7768E',        // Red - error messages
      warning: '#E0AF68',      // Yellow - warnings
      info: '#7AA2F7',         // Blue - info messages
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
 * All available themes
 */
export const themes: Record<string, Theme> = {
  'default-dark': defaultDarkTheme,
  'light': lightTheme,
  'monokai': monokaiTheme,
  'nord': nordTheme,
  'solarized-dark': solarizedDarkTheme,
  'solarized-light': solarizedLightTheme,
  'gruvbox-dark': gruvboxDarkTheme,
  'gruvbox-light': gruvboxLightTheme,
  'dracula': draculaTheme,
  'tokyo-night': tokyoNightTheme,
}

/**
 * Get theme by ID, fallback to default dark
 */
export function getTheme(themeId: string): Theme {
  return themes[themeId] || themes['default-dark']!
}

/**
 * Get list of theme IDs
 */
export function getThemeIds(): string[] {
  return Object.keys(themes)
}

/**
 * Current active theme - will be replaced with user preference from settings
 */
let currentTheme: Theme = defaultDarkTheme

/**
 * Set the active theme
 */
export function setTheme(themeId: string): void {
  currentTheme = getTheme(themeId)
}

/**
 * Get the current active theme
 */
export function getCurrentTheme(): Theme {
  return currentTheme
}

/**
 * Active theme - use this throughout the application
 */
export const theme = new Proxy({} as Theme, {
  get(_target, prop) {
    return currentTheme[prop as keyof Theme]
  }
})
