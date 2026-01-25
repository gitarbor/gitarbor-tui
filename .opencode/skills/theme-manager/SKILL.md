---
name: theme-manager
description: Update and maintain GitArbor TUI themes, add new themes, modify existing themes, and ensure theme consistency. Use when working with colors, themes, src/theme.ts, or when user mentions theming, color schemes, or visual customization.
license: MIT
metadata:
  author: gitarbor
  version: "1.0"
  category: ui
---

# Theme Manager Skill

Specialized skill for updating and maintaining the GitArbor TUI theme system.

## Reference Documentation

This skill includes comprehensive reference documentation:

- **[THEMES.md](references/THEMES.md)** - User-facing documentation for all themes, usage guide, and theme switching instructions
- **[THEME_REFERENCE.md](references/THEME_REFERENCE.md)** - Quick reference chart with theme comparisons and color palettes
- **[THEME_IMPLEMENTATION.md](references/THEME_IMPLEMENTATION.md)** - Implementation history, technical details, and development summary

## When to use this skill

Use this skill when:
- User wants to add a new theme to GitArbor
- User wants to modify an existing theme's colors
- User reports theme-related bugs or inconsistencies
- User asks about theme structure or design tokens
- User wants to update theme documentation
- User mentions specific color schemes (Catppuccin, One Dark, etc.)
- User wants to ensure all components use theme tokens correctly

## What this skill does

This skill provides comprehensive guidance for:
1. Adding new themes to the theme system
2. Modifying existing theme colors
3. Validating theme structure and completeness
4. Ensuring components use theme tokens (no hardcoded colors)
5. Updating theme documentation
6. Testing theme changes across the application
7. Maintaining theme consistency and quality

## Theme System Architecture

### Core Files
- `src/theme.ts` - Theme definitions, management functions, and active theme proxy
- `THEMES.md` - User-facing documentation for all themes
- `THEME_REFERENCE.md` - Quick reference chart with color comparisons
- `THEME_IMPLEMENTATION.md` - Implementation history and technical details
- `~/.gitarborrc` - User's theme preference storage

### Theme Structure

Every theme must implement the `Theme` interface:

```typescript
interface Theme {
  name: string              // Display name
  description: string       // Brief description
  colors: {
    primary: string         // Main accent color
    primaryDark: string     // Darker variant
    border: string          // Unfocused borders
    borderFocused: string   // Focused borders
    background: {
      primary: string       // Main background
      modal: string         // Modal backgrounds
      button: string        // Button backgrounds
      buttonHover: string   // Button hover state
    }
    text: {
      primary: string       // Main text
      secondary: string     // Secondary text
      muted: string         // Muted/disabled
      disabled: string      // Disabled state
      inverted: string      // Text on bright bg
    }
    git: {
      staged: string        // Staged files (typically green)
      modified: string      // Modified files (typically yellow)
      untracked: string     // Untracked files (typically gray/cyan)
      deleted: string       // Deleted files (typically red)
      added: string         // Added lines in diff (typically green)
    }
    status: {
      success: string       // Success messages (typically green)
      error: string         // Error messages (typically red)
      warning: string       // Warning messages (typically yellow)
      info: string          // Info messages (typically cyan/blue)
    }
  }
  spacing: {
    none: number           // 0
    xs: number            // 1
    sm: number            // 2
    md: number            // 3
    lg: number            // 4
    xl: number            // 5
  }
  borders: {
    style: 'single'       // Border style (currently only 'single')
  }
}
```

## Adding a New Theme: Step-by-Step

### Step 1: Research the color scheme
1. Find the official color scheme documentation/repository
2. Identify all primary colors used in the scheme
3. Note the background colors (for dark/light variants)
4. Understand the scheme's design philosophy

### Step 2: Create the theme object in src/theme.ts

Add after existing theme definitions, before the `themes` export:

```typescript
/**
 * Theme Name - Brief description
 */
const themeNameTheme: Theme = {
  name: 'Theme Name',
  description: 'Brief description of the theme',
  colors: {
    primary: '#XXXXXX',        // Choose the main accent color
    primaryDark: '#XXXXXX',    // Darker variant (20-30% darker)
    border: '#XXXXXX',         // Subtle border color
    borderFocused: '#XXXXXX',  // Use primary or similar
    background: {
      primary: '#XXXXXX',      // Main background
      modal: '#XXXXXX',        // Slightly different from primary
      button: '#XXXXXX',       // Button backgrounds
      buttonHover: '#XXXXXX',  // Lighter/darker on hover
    },
    text: {
      primary: '#XXXXXX',      // Main text color
      secondary: '#XXXXXX',    // Slightly muted
      muted: '#XXXXXX',        // More muted
      disabled: '#XXXXXX',     // Even more muted
      inverted: '#XXXXXX',     // Opposite of background
    },
    git: {
      staged: '#XXXXXX',       // Green variant from scheme
      modified: '#XXXXXX',     // Yellow/orange variant
      untracked: '#XXXXXX',    // Gray or cyan variant
      deleted: '#XXXXXX',      // Red variant
      added: '#XXXXXX',        // Same as staged typically
    },
    status: {
      success: '#XXXXXX',      // Same as git.staged typically
      error: '#XXXXXX',        // Same as git.deleted typically
      warning: '#XXXXXX',      // Same as git.modified typically
      info: '#XXXXXX',         // Cyan or blue variant
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
```

### Step 3: Add to themes registry

In the `themes` export object, add your new theme:

```typescript
export const themes: Record<string, Theme> = {
  // ... existing themes
  'theme-id': themeNameTheme,
}
```

**Theme ID naming conventions:**
- Use lowercase with hyphens
- Match the popular name (e.g., `catppuccin-mocha`, `one-dark`)
- For variants, include variant name (e.g., `gruvbox-dark`, `gruvbox-light`)

### Step 4: Update THEMES.md

Add to the appropriate section (Dark Themes or Light Themes):

```markdown
### Dark Themes (or Light Themes)

X. **Theme Name**
   - Brief description from official docs
   - Primary color: Color name (#XXXXXX)
   - Best for: Use case description
```

Add theme ID to the manual config section:

```markdown
Available theme IDs:
- `theme-id`
```

### Step 5: Update THEME_REFERENCE.md

Add a row to the theme comparison chart:

```markdown
| **Theme Name** | Dark/Light | 🎨 Color | 🟢 Color | 🟡 Color | ⬛/⬜ BG | Best For |
```

Add a color palette section:

```markdown
### Theme Name
```
Primary:       #XXXXXX (Color name)
Staged:        #XXXXXX (Green variant)
Modified:      #XXXXXX (Yellow variant)
Untracked:     #XXXXXX (Gray/Cyan)
Deleted:       #XXXXXX (Red variant)
Background:    #XXXXXX (Background color)
```
```

### Step 6: Test the theme

1. Run type checking:
   ```bash
   bun --bun tsc --noEmit
   ```

2. Start the application:
   ```bash
   bun run start
   ```

3. Open settings (`,` key) → Switch to Themes tab (Tab key)

4. Verify your new theme appears in the list

5. Select it and check the preview panel:
   - All colors should be visible
   - Colors should match your theme definition
   - No colors should be missing or default

6. Apply the theme and verify:
   - Status view colors (staged, modified, untracked)
   - Diff view colors (added, deleted lines)
   - Status messages (success, error, warning, info)
   - Borders (focused vs unfocused)
   - Text readability on background

### Step 7: Commit changes

Include all modified files:
- `src/theme.ts`
- `THEMES.md`
- `THEME_REFERENCE.md`

Use a commit message like:
```
Add [Theme Name] theme

Adds [Theme Name] as a new [dark/light] theme option with [description].
Colors sourced from official [Theme Name] color scheme.
```

## Modifying an Existing Theme

### Step 1: Identify the theme
Find the theme object in `src/theme.ts` (e.g., `nordTheme`, `monokaiTheme`)

### Step 2: Update colors
Modify the specific color values in the theme object:

```typescript
const nordTheme: Theme = {
  // ... existing fields
  colors: {
    // ... existing colors
    primary: '#NEW_COLOR',  // Update specific color
  }
}
```

### Step 3: Update documentation
If color changes are significant, update:
- `THEMES.md` - Description or "Best for" section
- `THEME_REFERENCE.md` - Color palette if primary colors changed

### Step 4: Test changes
Follow testing steps from "Adding a New Theme" section

### Step 5: Commit
```
Update [Theme Name] theme colors

Changes [specific color] from [old] to [new] to [reason].
```

## Color Selection Guidelines

### Contrast requirements
- **Text on background**: Minimum 4.5:1 contrast ratio (WCAG AA)
- **Interactive elements**: Minimum 3:1 contrast ratio
- **Borders**: Should be visible but not distracting

### Git status colors (semantic meaning)
- **Staged/Added**: Green shades (#00FF00, #00AA00, #A6E22E, etc.)
  - Represents "good", "added", "ready"
- **Modified**: Yellow/orange shades (#FFFF00, #CC8800, #E6DB74, etc.)
  - Represents "changed", "pending", "attention needed"
- **Untracked**: Gray or cyan shades (#CCCCCC, #666666, #81A1C1, etc.)
  - Represents "new", "not tracked yet"
- **Deleted**: Red shades (#FF0000, #CC0000, #F92672, etc.)
  - Represents "removed", "error", "danger"

### Background colors
- **Dark themes**: Use dark backgrounds (#000000 to #3B4261)
- **Light themes**: Use light backgrounds (#FFFFFF to #FDF6E3)
- **Modals**: Slightly different from primary (darker for dark, lighter for light)
- **Buttons**: Distinct from background, visible when focused

### Primary accent color
- Should stand out against background
- Used for focused elements, highlights
- Common choices: Blue, orange, purple, pink, cyan
- Should match the theme's overall aesthetic

## Common Patterns

### Creating color variants
To create a darker variant of a color:
```javascript
// If primary is #CC8844
// primaryDark is approximately 10-20% darker: #BB7733 or #AA6622
```

Use a color picker tool or HSL adjustment:
- Reduce L (lightness) by 10-15% for darker variant
- Increase L by 10-15% for lighter variant

### Borrowing from existing schemes
Many popular themes have official color definitions:
- **Nord**: https://www.nordtheme.com/docs/colors-and-palettes
- **Solarized**: https://ethanschoonover.com/solarized/
- **Gruvbox**: https://github.com/morhetz/gruvbox
- **Dracula**: https://draculatheme.com/contribute
- **Tokyo Night**: https://github.com/enkia/tokyo-night-vscode-theme
- **Catppuccin**: https://github.com/catppuccin/catppuccin
- **One Dark**: https://github.com/atom/atom/tree/master/packages/one-dark-syntax

### Light theme from dark theme
When creating a light variant:
1. Invert background (dark → light)
2. Invert text (light → dark)
3. Adjust primary color if needed (some colors work for both)
4. Keep git colors semantic (green=good, red=bad)
5. Reduce saturation/brightness of accent colors

## Validation Checklist

Before finalizing theme changes:

- [ ] Theme object implements full `Theme` interface
- [ ] All color fields use hex format (#XXXXXX)
- [ ] Spacing values match standard (0, 1, 2, 3, 4, 5)
- [ ] Border style is 'single'
- [ ] Theme added to `themes` export object
- [ ] Theme ID follows naming conventions (lowercase-with-hyphens)
- [ ] `THEMES.md` updated with description
- [ ] `THEME_REFERENCE.md` updated with color palette
- [ ] Type checking passes (`bun --bun tsc --noEmit`)
- [ ] Theme appears in settings modal
- [ ] Preview shows all colors correctly
- [ ] Theme applies without errors
- [ ] Git status colors are semantically correct
- [ ] Text is readable on background
- [ ] Borders are visible
- [ ] Status messages use appropriate colors

## Ensuring Components Use Theme Tokens

### The Rule
**NEVER hardcode colors in components.** Always use `theme.colors.*`

### Incorrect (hardcoded):
```typescript
<text fg="#FFFFFF">Text</text>
<box borderColor="#555555">...</box>
```

### Correct (using theme):
```typescript
import { theme } from '../theme'

<text fg={theme.colors.text.primary}>Text</text>
<box borderColor={theme.colors.border}>...</box>
```

### Finding hardcoded colors
Search for hex colors in component files:
```bash
grep -r '#[0-9A-Fa-f]\{6\}' src/components/
```

### Common theme token mappings

| Use Case | Theme Token |
|----------|-------------|
| Main text | `theme.colors.text.primary` |
| Muted text | `theme.colors.text.muted` |
| Focused border | `theme.colors.borderFocused` |
| Unfocused border | `theme.colors.border` |
| Accent/highlight | `theme.colors.primary` |
| Success message | `theme.colors.status.success` |
| Error message | `theme.colors.status.error` |
| Staged file | `theme.colors.git.staged` |
| Modified file | `theme.colors.git.modified` |

## Troubleshooting

### Theme doesn't appear in settings
- Check that theme is added to `themes` export in `src/theme.ts`
- Verify theme ID doesn't have typos
- Restart the application

### Colors don't match preview
- Ensure theme preference is saved in `~/.gitarborrc`
- Restart application after changing theme
- Check terminal supports true colors (24-bit color)

### Type errors after adding theme
- Verify theme object matches `Theme` interface exactly
- Check all required fields are present
- Run `bun --bun tsc --noEmit` for detailed errors

### Theme looks different in terminal
- Terminal emulator may not support true colors
- Some terminals apply color transformations
- Test with different terminal emulator

## Best Practices

1. **Research first**: Study the official color scheme before creating a theme
2. **Test in context**: Apply theme and use the app for a few minutes
3. **Check accessibility**: Ensure text is readable and colors have sufficient contrast
4. **Be consistent**: Follow existing theme patterns and conventions
5. **Document well**: Add clear descriptions in THEMES.md
6. **Use semantic colors**: Green=good, red=bad, yellow=warning
7. **Keep spacing standard**: Don't change spacing values unless necessary
8. **Version control**: Commit theme and docs together
9. **Name clearly**: Use recognizable, searchable theme names
10. **Test edge cases**: Check with very long file names, deep nesting, etc.

## Examples

### Example: Adding Catppuccin Mocha

1. Research: Visit https://github.com/catppuccin/catppuccin
2. Identify colors from Mocha palette:
   - Background: #1E1E2E
   - Primary text: #CDD6F4
   - Accent (Mauve): #CBA6F7
   - Green: #A6E3A1
   - Yellow: #F9E2AF
   - Red: #F38BA8

3. Create theme object:
```typescript
const catppuccinMochaTheme: Theme = {
  name: 'Catppuccin Mocha',
  description: 'Soothing pastel theme for the high-spirited',
  colors: {
    primary: '#CBA6F7',       // Mauve
    primaryDark: '#B493E0',   // Darker mauve
    border: '#45475A',        // Surface1
    borderFocused: '#CBA6F7', // Mauve
    background: {
      primary: '#1E1E2E',     // Base
      modal: '#181825',       // Mantle
      button: '#313244',      // Surface0
      buttonHover: '#45475A', // Surface1
    },
    text: {
      primary: '#CDD6F4',     // Text
      secondary: '#BAC2DE',   // Subtext1
      muted: '#A6ADC8',       // Subtext0
      disabled: '#585B70',    // Surface2
      inverted: '#1E1E2E',    // Base
    },
    git: {
      staged: '#A6E3A1',      // Green
      modified: '#F9E2AF',    // Yellow
      untracked: '#89DCEB',   // Sky
      deleted: '#F38BA8',     // Red
      added: '#A6E3A1',       // Green
    },
    status: {
      success: '#A6E3A1',     // Green
      error: '#F38BA8',       // Red
      warning: '#F9E2AF',     // Yellow
      info: '#89B4FA',        // Blue
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
```

4. Add to themes:
```typescript
export const themes: Record<string, Theme> = {
  // ... existing
  'catppuccin-mocha': catppuccinMochaTheme,
}
```

5. Update THEMES.md, THEME_REFERENCE.md

6. Test and commit

## Quick Reference Commands

```bash
# Type check
bun --bun tsc --noEmit

# Start app
bun run start

# Search for hardcoded colors in components
grep -r '#[0-9A-Fa-f]\{6\}' src/components/

# View current theme preference
cat ~/.gitarborrc

# Set theme manually
echo '{"theme":"theme-id"}' > ~/.gitarborrc
```

## Resources

- Project theme docs: `THEMES.md`
- Color reference: `THEME_REFERENCE.md`
- Implementation notes: `THEME_IMPLEMENTATION.md`
- Theme source: `src/theme.ts`
- Settings UI: `src/components/SettingsModal.tsx`

## Notes for Agents

- Always run type checking after modifying `src/theme.ts`
- Test theme in the actual application, not just type checking
- When adding multiple themes, do one at a time to catch errors early
- Use the existing 10 themes as templates and references
- Preserve the comment style and structure in `src/theme.ts`
- Keep theme objects alphabetically ordered for easier maintenance
