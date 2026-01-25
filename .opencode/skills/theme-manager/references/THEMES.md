# GitArbor TUI - Themes Guide

GitArbor supports custom color themes to personalize your terminal experience. Choose from 10 built-in themes or create your own.

## Available Themes

### Dark Themes

1. **Default Dark** (default)
   - Classic dark terminal with orange accents
   - High contrast with bright colors
   - Best for: General use

2. **Monokai**
   - Inspired by the popular Monokai color scheme
   - Pink accents with vibrant colors
   - Best for: Developers familiar with Monokai

3. **Nord**
   - Arctic, north-bluish color palette
   - Muted, professional appearance
   - Best for: Long coding sessions, eye comfort

4. **Solarized Dark**
   - Precision colors scientifically designed
   - Blue accents with earthy tones
   - Best for: Reduced eye strain

5. **Gruvbox Dark**
   - Retro groove with warm palette
   - Orange accents, vintage feel
   - Best for: Those who prefer warm colors

6. **Dracula**
   - Dark theme with vibrant purple and pink
   - High contrast, bold colors
   - Best for: Vibrant, energetic feel

7. **Tokyo Night**
   - Clean dark theme inspired by Tokyo's neon lights
   - Blue accents with modern feel
   - Best for: Modern, sleek appearance

### Light Themes

8. **Light**
   - Clean light theme for bright environments
   - Blue accents on white background
   - Best for: Daytime use, well-lit rooms

9. **Solarized Light**
   - Light variant of Solarized
   - Precision colors on light background
   - Best for: Reduced glare, scientific design

10. **Gruvbox Light**
    - Light variant of Gruvbox
    - Warm palette on cream background
    - Best for: Comfortable daytime coding

## How to Change Themes

### Using the Settings Modal

1. Press `,` (comma) or `/` then select "Open Settings"
2. Press `Tab` to switch to the "Themes" tab
3. Use `Up/Down` arrows to browse themes
4. Preview colors in the right panel
5. Press `Enter` or `A` to apply the theme
6. **Restart GitArbor** to see full theme changes

### Manually Editing Config

Themes are stored in `~/.gitarborrc`:

```json
{
  "theme": "monokai"
}
```

Available theme IDs:
- `default-dark`
- `light`
- `monokai`
- `nord`
- `solarized-dark`
- `solarized-light`
- `gruvbox-dark`
- `gruvbox-light`
- `dracula`
- `tokyo-night`

## Color Categories

Each theme defines colors for:

### Git Status
- **Staged** - Files added to staging area
- **Modified** - Changed but unstaged files
- **Untracked** - New files not tracked by git
- **Deleted** - Removed files
- **Added** - Lines added in diffs

### Status Messages
- **Success** - Operation completed successfully
- **Error** - Operation failed
- **Warning** - Important notices
- **Info** - Informational messages

### UI Elements
- **Primary** - Focused elements, highlights
- **Border** - Panel borders
- **Text** - Various text emphasis levels

## Creating Custom Themes

To create your own theme:

1. Fork the project or edit `src/theme.ts`
2. Create a new theme object following the `Theme` interface:

```typescript
const myCustomTheme: Theme = {
  name: 'My Custom Theme',
  description: 'A theme tailored to my preferences',
  colors: {
    primary: '#FF6B6B',
    primaryDark: '#EE5A52',
    border: '#555555',
    borderFocused: '#FF6B6B',
    background: {
      primary: '#1A1A1A',
      modal: '#242424',
      button: '#2A2A2A',
      buttonHover: '#333333',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      muted: '#999999',
      disabled: '#666666',
      inverted: '#000000',
    },
    git: {
      staged: '#4ECDC4',
      modified: '#FFE66D',
      untracked: '#95A99C',
      deleted: '#FF6B6B',
      added: '#4ECDC4',
    },
    status: {
      success: '#4ECDC4',
      error: '#FF6B6B',
      warning: '#FFE66D',
      info: '#A8E6CF',
    },
  },
  spacing: { none: 0, xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  borders: { style: 'single' },
}
```

3. Add it to the `themes` object:

```typescript
export const themes: Record<string, Theme> = {
  // ... existing themes
  'my-custom': myCustomTheme,
}
```

4. Save and restart GitArbor

## Theme Design Tips

- **Contrast**: Ensure sufficient contrast between text and background
- **Git colors**: Use familiar colors (green for additions, red for deletions)
- **Accessibility**: Test colors for readability
- **Terminal support**: Not all terminals support all colors equally
- **Inspiration**: Browse existing themes or color scheme sites

## Troubleshooting

**Q: Theme didn't change after applying**
- Make sure to restart GitArbor completely

**Q: Colors look different than preview**
- Your terminal emulator may not support true colors
- Some terminals apply their own color transformations

**Q: Config file not working**
- Check JSON syntax in `~/.gitarborrc`
- Ensure theme ID matches exactly (case-sensitive)

**Q: How to reset to default theme**
- Delete `~/.gitarborrc` or set `"theme": "default-dark"`

## Sharing Your Theme

If you create a theme you love:
1. Submit a pull request to add it to the built-in themes
2. Share the theme object in GitHub Discussions
3. Include screenshots showing the theme in action

---

**Pro Tip**: Try different themes for different times of day - light themes during daytime, dark themes at night!
