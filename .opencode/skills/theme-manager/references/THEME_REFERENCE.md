# GitArbor Themes - Quick Reference

## Theme Comparison Chart

| Theme Name | Type | Primary | Git Staged | Git Modified | Background | Best For |
|------------|------|---------|------------|--------------|------------|----------|
| **Default Dark** | Dark | 🟠 Orange | 🟢 Bright Green | 🟡 Bright Yellow | ⬛ Black | Classic terminal look |
| **Light** | Light | 🔵 Blue | 🟢 Green | 🟠 Orange | ⬜ White | Bright environments |
| **Monokai** | Dark | 🩷 Pink | 🟢 Lime | 🟡 Yellow | ⬛ Dark Gray | Monokai lovers |
| **Nord** | Dark | 🔵 Frost Blue | 🟢 Soft Green | 🟡 Soft Yellow | ⬛ Polar Night | Eye comfort |
| **Solarized Dark** | Dark | 🔵 Blue | 🟢 Green | 🟡 Yellow | ⬛ Base03 | Scientific precision |
| **Solarized Light** | Light | 🔵 Blue | 🟢 Green | 🟡 Yellow | ⬜ Base3 | Reduced glare |
| **Gruvbox Dark** | Dark | 🟠 Orange | 🟢 Green | 🟡 Yellow | ⬛ Dark | Retro groove |
| **Gruvbox Light** | Light | 🟠 Orange | 🟢 Dark Green | 🟡 Dark Yellow | ⬜ Cream | Warm daytime |
| **Dracula** | Dark | 🟣 Purple | 🟢 Bright Green | 🟡 Bright Yellow | ⬛ Dark | Vibrant purple |
| **Tokyo Night** | Dark | 🔵 Blue | 🟢 Green | 🟡 Gold | ⬛ Deep Blue | Modern neon |

## Color Palettes

### Default Dark
```
Primary:       #CC8844 (Orange)
Staged:        #00FF00 (Bright Green)
Modified:      #FFFF00 (Bright Yellow)
Untracked:     #CCCCCC (Light Gray)
Deleted:       #FF0000 (Red)
Background:    #000000 (Black)
```

### Light
```
Primary:       #0066CC (Blue)
Staged:        #00AA00 (Green)
Modified:      #CC8800 (Orange)
Untracked:     #666666 (Gray)
Deleted:       #CC0000 (Red)
Background:    #FFFFFF (White)
```

### Monokai
```
Primary:       #F92672 (Pink)
Staged:        #A6E22E (Lime)
Modified:      #E6DB74 (Yellow)
Untracked:     #75715E (Gray)
Deleted:       #F92672 (Pink)
Background:    #272822 (Dark Brown)
```

### Nord
```
Primary:       #88C0D0 (Frost Blue)
Staged:        #A3BE8C (Aurora Green)
Modified:      #EBCB8B (Aurora Yellow)
Untracked:     #81A1C1 (Frost Blue)
Deleted:       #BF616A (Aurora Red)
Background:    #2E3440 (Polar Night)
```

### Solarized Dark
```
Primary:       #268BD2 (Blue)
Staged:        #859900 (Green)
Modified:      #B58900 (Yellow)
Untracked:     #93A1A1 (Base1)
Deleted:       #DC322F (Red)
Background:    #002B36 (Base03)
```

### Solarized Light
```
Primary:       #268BD2 (Blue)
Staged:        #859900 (Green)
Modified:      #B58900 (Yellow)
Untracked:     #586E75 (Base01)
Deleted:       #DC322F (Red)
Background:    #FDF6E3 (Base3)
```

### Gruvbox Dark
```
Primary:       #FE8019 (Orange)
Staged:        #B8BB26 (Green)
Modified:      #FABD2F (Yellow)
Untracked:     #928374 (Gray)
Deleted:       #FB4934 (Red)
Background:    #282828 (Dark)
```

### Gruvbox Light
```
Primary:       #AF3A03 (Orange)
Staged:        #79740E (Green)
Modified:      #B57614 (Yellow)
Untracked:     #928374 (Gray)
Deleted:       #9D0006 (Red)
Background:    #FBF1C7 (Cream)
```

### Dracula
```
Primary:       #BD93F9 (Purple)
Staged:        #50FA7B (Green)
Modified:      #F1FA8C (Yellow)
Untracked:     #8BE9FD (Cyan)
Deleted:       #FF5555 (Red)
Background:    #282A36 (Dark)
```

### Tokyo Night
```
Primary:       #7AA2F7 (Blue)
Staged:        #9ECE6A (Green)
Modified:      #E0AF68 (Yellow)
Untracked:     #7DCFFF (Cyan)
Deleted:       #F7768E (Red)
Background:    #1A1B26 (Deep Blue)
```

## Usage Statistics

**Total Themes**: 10
- **Dark Themes**: 7 (70%)
- **Light Themes**: 3 (30%)

**Color Scheme Families**:
- Unique/Original: 3 (Default Dark, Light, Tokyo Night)
- Popular Ports: 7 (Monokai, Nord, Solarized x2, Gruvbox x2, Dracula)

## Switching Between Themes

### Quick Access
```
Press: ,       → Open Settings
Press: Tab     → Switch to Themes tab
Press: ↑/↓     → Browse themes
Press: Enter   → Apply theme
Restart app    → See full changes
```

### Config File
Edit `~/.gitarborrc`:
```json
{
  "theme": "tokyo-night"
}
```

## Popular Theme Combinations

### For Different Scenarios

**Long Coding Sessions (Eye Comfort)**
- Primary: Nord
- Alternative: Solarized Dark

**Daytime Work (Well-lit Room)**
- Primary: Light
- Alternative: Solarized Light, Gruvbox Light

**Night Coding (Dark Room)**
- Primary: Tokyo Night
- Alternative: Dracula, Monokai

**Vintage/Retro Feel**
- Primary: Gruvbox Dark
- Alternative: Gruvbox Light

**Maximum Contrast**
- Primary: Default Dark
- Alternative: Light

## Color Accessibility Notes

All themes provide:
- ✅ Distinct colors for git status (staged vs modified vs untracked)
- ✅ Clear success/error differentiation (green vs red)
- ✅ Readable text on background (sufficient contrast)
- ✅ Visible borders and UI elements

**Note**: Color perception may vary based on:
- Terminal emulator color support
- Monitor calibration
- Personal color blindness considerations
- Ambient lighting conditions

## Theme Preferences by Use Case

| Use Case | Recommended Theme | Why |
|----------|-------------------|-----|
| First-time user | Default Dark | Familiar, high contrast |
| VS Code user | Monokai, Tokyo Night | Similar to popular VS Code themes |
| Vim user | Gruvbox Dark, Monokai | Popular in Vim community |
| Long sessions | Nord, Solarized Dark | Designed for eye comfort |
| Bright office | Light, Solarized Light | Clear in bright light |
| Home office | Gruvbox Light | Warm, comfortable |
| Late night | Tokyo Night, Dracula | Not too bright |
| Color enthusiast | Dracula | Most vibrant colors |

---

**Remember**: Theme preference is personal! Try them all and pick your favorite. 🎨
