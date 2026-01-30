<template>
  <div class="themes-page">
    <div class="container">
      <div class="themes-header text-center mb-2xl">
        <h1 class="mb-md">Themes</h1>
        <p class="text-muted">
          Choose from 10+ carefully crafted themes to personalize your GitArbor experience.
          <br />
          Each theme is designed for optimal readability and aesthetics in the terminal.
        </p>
      </div>

      <div class="themes-grid">
        <div v-for="theme in themes" :key="theme.id" class="theme-card card">
          <div class="theme-preview">
            <img
              :src="theme.screenshot"
              :alt="`${theme.name} theme screenshot`"
              class="theme-screenshot"
            />
          </div>

          <div class="theme-info">
            <h3>{{ theme.name }}</h3>
            <p class="text-muted">{{ theme.description }}</p>

            <div class="theme-colors">
              <div
                class="color-swatch"
                :style="{ background: theme.colors.primary }"
                :title="`Primary: ${theme.colors.primary}`"
              ></div>
              <div
                class="color-swatch"
                :style="{ background: theme.colors.staged }"
                :title="`Staged: ${theme.colors.staged}`"
              ></div>
              <div
                class="color-swatch"
                :style="{ background: theme.colors.modified }"
                :title="`Modified: ${theme.colors.modified}`"
              ></div>
              <div
                class="color-swatch"
                :style="{ background: theme.colors.text }"
                :title="`Text: ${theme.colors.text}`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="themes-info mt-3xl">
        <div class="info-card card text-center">
          <h2 class="mb-md">How to Change Themes</h2>
          <p class="text-muted mb-lg">Change your theme in GitArbor with these simple steps:</p>

          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <p class="text-muted">Press <kbd>/</kbd> to open Settings Modal</p>
            </div>
            <div class="step-arrow">→</div>
            <div class="step">
              <div class="step-number">2</div>
              <p class="text-muted">Select "Change Theme"</p>
            </div>
            <div class="step-arrow">→</div>
            <div class="step">
              <div class="step-number">3</div>
              <p class="text-muted">Choose your theme</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const themes = [
  {
    id: 'default-dark',
    name: 'Default Dark',
    description: 'Classic dark theme with orange accents',
    screenshot: '/screenshots/themes/default.png',
    colors: {
      bg: '#000000',
      border: '#555555',
      primary: '#CC8844',
      text: '#FFFFFF',
      muted: '#999999',
      staged: '#00FF00',
      modified: '#FFFF00',
      untracked: '#CCCCCC',
    },
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Clean light theme for bright environments',
    screenshot: '/screenshots/themes/light.png',
    colors: {
      bg: '#FFFFFF',
      border: '#CCCCCC',
      primary: '#0066CC',
      text: '#000000',
      muted: '#666666',
      staged: '#00AA00',
      modified: '#CC8800',
      untracked: '#666666',
    },
  },
  {
    id: 'monokai',
    name: 'Monokai',
    description: 'Dark theme inspired by the Monokai color scheme',
    screenshot: '/screenshots/themes/monokai.png',
    colors: {
      bg: '#272822',
      border: '#49483E',
      primary: '#F92672',
      text: '#F8F8F2',
      muted: '#75715E',
      staged: '#A6E22E',
      modified: '#E6DB74',
      untracked: '#75715E',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'Arctic, north-bluish color palette',
    screenshot: '/screenshots/themes/nord.png',
    colors: {
      bg: '#2E3440',
      border: '#4C566A',
      primary: '#88C0D0',
      text: '#ECEFF4',
      muted: '#81A1C1',
      staged: '#A3BE8C',
      modified: '#EBCB8B',
      untracked: '#81A1C1',
    },
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    description: 'Precision color scheme for the terminal',
    screenshot: '/screenshots/themes/solarized-dark.png',
    colors: {
      bg: '#002B36',
      border: '#586E75',
      primary: '#268BD2',
      text: '#EEE8D5',
      muted: '#657B83',
      staged: '#859900',
      modified: '#B58900',
      untracked: '#93A1A1',
    },
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    description: 'Light variant of Solarized color scheme',
    screenshot: '/screenshots/themes/solarized-light.png',
    colors: {
      bg: '#FDF6E3',
      border: '#93A1A1',
      primary: '#268BD2',
      text: '#002B36',
      muted: '#839496',
      staged: '#859900',
      modified: '#B58900',
      untracked: '#586E75',
    },
  },
  {
    id: 'gruvbox-dark',
    name: 'Gruvbox Dark',
    description: 'Retro groove color scheme with warm palette',
    screenshot: '/screenshots/themes/gruvbox-dark.png',
    colors: {
      bg: '#282828',
      border: '#504945',
      primary: '#FE8019',
      text: '#EBDBB2',
      muted: '#928374',
      staged: '#B8BB26',
      modified: '#FABD2F',
      untracked: '#928374',
    },
  },
  {
    id: 'gruvbox-light',
    name: 'Gruvbox Light',
    description: 'Light variant of Gruvbox color scheme',
    screenshot: '/screenshots/themes/gruvbox-light.png',
    colors: {
      bg: '#FBF1C7',
      border: '#D5C4A1',
      primary: '#AF3A03',
      text: '#3C3836',
      muted: '#928374',
      staged: '#79740E',
      modified: '#B57614',
      untracked: '#928374',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'Dark theme with vibrant purple and pink accents',
    screenshot: '/screenshots/themes/dracula.png',
    colors: {
      bg: '#282A36',
      border: '#44475A',
      primary: '#BD93F9',
      text: '#F8F8F2',
      muted: '#6272A4',
      staged: '#50FA7B',
      modified: '#F1FA8C',
      untracked: '#8BE9FD',
    },
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    description: "Clean dark theme inspired by Tokyo's neon lights",
    screenshot: '/screenshots/themes/tokyo-night.png',
    colors: {
      bg: '#1A1B26',
      border: '#3B4261',
      primary: '#7AA2F7',
      text: '#C0CAF5',
      muted: '#565F89',
      staged: '#9ECE6A',
      modified: '#E0AF68',
      untracked: '#7DCFFF',
    },
  },
];

useHead({
  title: 'Themes - GitArbor TUI',
  meta: [
    {
      name: 'description',
      content:
        'Browse 10+ beautiful themes for GitArbor TUI including Dracula, Nord, Gruvbox, Monokai, and more. Personalize your terminal Git experience.',
    },
  ],
});

useSeoMeta({
  title: 'Themes - GitArbor TUI',
  ogTitle: 'Themes - GitArbor TUI',
  description:
    'Browse 10+ beautiful themes for GitArbor TUI including Dracula, Nord, Gruvbox, Monokai, and more. Personalize your terminal Git experience.',
  ogDescription:
    'Browse 10+ beautiful themes for GitArbor TUI including Dracula, Nord, Gruvbox, Monokai, and more.',
});
</script>

<style scoped>
.themes-page {
  padding: var(--spacing-2xl) 0;
}

.themes-header {
  max-width: 700px;
  margin: 0 auto var(--spacing-2xl);
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
}

.theme-card {
  overflow: hidden;
  padding: 0;
}

.theme-preview {
  background: #000;
  position: relative;
  overflow: hidden;
}

.theme-screenshot {
  width: 100%;
  height: auto;
  display: block;
  border-bottom: 1px solid var(--color-border);
}

.theme-info {
  padding: var(--spacing-lg);
}

.theme-info h3 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
  font-size: 1.25rem;
}

.theme-info p {
  margin-bottom: var(--spacing-md);
  font-size: 0.9rem;
}

.theme-colors {
  display: flex;
  gap: var(--spacing-xs);
}

.color-swatch {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.themes-info {
  max-width: 800px;
  margin: 0 auto;
}

.info-card {
  padding: var(--spacing-2xl);
  background: linear-gradient(135deg, rgba(204, 136, 68, 0.1) 0%, rgba(187, 119, 51, 0.05) 100%);
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  flex-wrap: wrap;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.step-number {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: var(--color-bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(204, 136, 68, 0.3);
}

.step p {
  margin: 0;
  max-width: 180px;
}

.step-arrow {
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: bold;
}

kbd {
  font-family: var(--font-mono);
  background: var(--color-bg-highlight);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.125rem 0.5rem;
  font-size: 0.9em;
  color: var(--color-primary);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .themes-grid {
    grid-template-columns: 1fr;
  }

  .steps {
    flex-direction: column;
  }

  .step-arrow {
    transform: rotate(90deg);
  }
}
</style>
