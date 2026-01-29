<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            The Git Client<br />
            Built for Developers
          </h1>
          <p class="hero-subtitle">
            A next-generation Git client that runs in your terminal.
            <br />
            Fast, beautiful, and built with modern technologies.
          </p>
          <div class="hero-cta">
            <NuxtLink to="/docs/installation" class="btn btn-primary btn-large">
              Get Started
            </NuxtLink>
            <a href="https://github.com/cadamsdev/gitarbor-tui" target="_blank" rel="noopener" class="btn btn-outline btn-large">
              View on GitHub
            </a>
          </div>
          
          <div class="hero-demo">
            <img src="/screenshots/preview.png" alt="GitArbor Interface Preview" class="hero-screenshot" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features py-2xl">
      <div class="container">
        <h2 class="text-center mb-2xl">Why GitArbor?</h2>
        
        <div class="features-grid">
          <div class="feature-card card">
            <div class="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Built with Bun runtime for instant startup and blazing-fast performance. No lag, no waiting.</p>
          </div>
          
          <div class="feature-card card">
            <div class="feature-icon">🎨</div>
            <h3>Beautiful Interface</h3>
            <p>Powered by OpenTUI and React for a smooth, intuitive terminal UI with multiple themes.</p>
          </div>
          
          <div class="feature-card card">
            <div class="feature-icon">⌨️</div>
            <h3>Keyboard-First</h3>
            <p>Navigate your repositories with vim-like keybindings. Mouse optional, keyboard optimized.</p>
          </div>
          
          <div class="feature-card card">
            <div class="feature-icon">🔍</div>
            <h3>Powerful Search</h3>
            <p>Command palette for instant access to any feature. Find commits, branches, and files instantly.</p>
          </div>
          
          <div class="feature-card card">
            <div class="feature-icon">🎭</div>
            <h3>Multiple Themes</h3>
            <p>Choose from 10+ carefully crafted themes including Dracula, Nord, Gruvbox, and more.</p>
          </div>
          
          <div class="feature-card card">
            <div class="feature-icon">🚀</div>
            <h3>Modern Stack</h3>
            <p>Built with TypeScript, React 19, and the latest web technologies adapted for the terminal.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Screenshots Section -->
    <section class="screenshots py-2xl">
      <div class="container">
        <h2 class="text-center mb-lg">See It In Action</h2>
        <p class="text-center text-muted mb-2xl">
          Explore GitArbor's powerful features through real screenshots
        </p>
        
        <div class="screenshots-grid">
          <div class="screenshot-item">
            <img src="/screenshots/preview.png" alt="GitArbor Main View" class="screenshot-img" loading="lazy" />
            <h4>Main Dashboard</h4>
            <p class="text-muted">View repository status, branches, and recent commits at a glance</p>
          </div>
          
          <div class="screenshot-item">
            <img src="/screenshots/commit.png" alt="Commit Changes" class="screenshot-img" loading="lazy" />
            <h4>Commit Changes</h4>
            <p class="text-muted">Stage files and create commits with an intuitive interface</p>
          </div>
          
          <div class="screenshot-item">
            <img src="/screenshots/commit-history.png" alt="Commit History" class="screenshot-img" loading="lazy" />
            <h4>Commit History</h4>
            <p class="text-muted">Browse commit history with detailed information and diffs</p>
          </div>
          
          <div class="screenshot-item">
            <img src="/screenshots/create-branches.png" alt="Branch Management" class="screenshot-img" loading="lazy" />
            <h4>Branch Management</h4>
            <p class="text-muted">Create, switch, and manage branches effortlessly</p>
          </div>
          
          <div class="screenshot-item">
            <img src="/screenshots/stash-view.png" alt="Stash Management" class="screenshot-img" loading="lazy" />
            <h4>Stash Management</h4>
            <p class="text-muted">Save and restore work in progress with ease</p>
          </div>
          
          <div class="screenshot-item">
            <img src="/screenshots/cherry-pick.png" alt="Cherry Pick" class="screenshot-img" loading="lazy" />
            <h4>Cherry Pick Commits</h4>
            <p class="text-muted">Apply specific commits from other branches</p>
          </div>
          
          <div class="screenshot-item">
            <img src="/screenshots/repos-view.png" alt="Repository Management" class="screenshot-img" loading="lazy" />
            <h4>Multiple Repositories</h4>
            <p class="text-muted">Manage and switch between multiple Git repositories</p>
          </div>
          
          <div class="screenshot-item">
            <img src="/screenshots/remotes-view.png" alt="Remote Management" class="screenshot-img" loading="lazy" />
            <h4>Remote Management</h4>
            <p class="text-muted">View and manage remote repositories and fetch/push changes</p>
          </div>
          
          <div class="screenshot-item">
            <img src="/screenshots/themes.png" alt="Theme Selection" class="screenshot-img" loading="lazy" />
            <h4>Beautiful Themes</h4>
            <p class="text-muted">Choose from 10+ carefully crafted color themes</p>
          </div>
          
          <div class="screenshot-item">
            <img src="/screenshots/settings.png" alt="Settings" class="screenshot-img" loading="lazy" />
            <h4>Customizable Settings</h4>
            <p class="text-muted">Configure GitArbor to match your workflow</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="tech-stack py-2xl">
      <div class="container">
        <h2 class="text-center mb-lg">Built With Modern Technologies</h2>
        <p class="text-center text-muted mb-2xl">
          GitArbor leverages cutting-edge tools to deliver the best terminal experience
        </p>
        
        <div class="tech-grid">
          <div class="tech-item">
            <div class="tech-logo">
              <Icon name="devicon:bun" class="tech-logo-icon" />
            </div>
            <h4>Bun</h4>
            <p class="text-muted">Fast JavaScript runtime</p>
          </div>
          
          <div class="tech-item">
            <div class="tech-logo">
              <svg class="tech-logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="3" width="20" height="18" fill="rgb(237, 233, 233)"></rect>
                <rect x="6" y="8" width="3" height="8" fill="rgb(24, 22, 22)"></rect>
              </svg>
            </div>
            <h4>OpenTUI</h4>
            <p class="text-muted">React for terminals</p>
          </div>
          
          <div class="tech-item">
            <div class="tech-logo">
              <Icon name="devicon:react" class="tech-logo-icon" />
            </div>
            <h4>React 19</h4>
            <p class="text-muted">Latest React features</p>
          </div>
          
          <div class="tech-item">
            <div class="tech-logo">
              <Icon name="devicon:typescript" class="tech-logo-icon" />
            </div>
            <h4>TypeScript</h4>
            <p class="text-muted">Type-safe code</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta py-2xl">
      <div class="container">
        <div class="cta-card card text-center">
          <h2 class="mb-md">Ready to Get Started?</h2>
          <p class="text-muted mb-xl">
            Install GitArbor and experience a better way to work with Git in your terminal.
          </p>
          <div class="cta-buttons">
            <NuxtLink to="/docs/installation" class="btn btn-primary btn-large">
              Install Now
            </NuxtLink>
            <NuxtLink to="/docs" class="btn btn-outline btn-large">
              Read Documentation
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'GitArbor TUI - Next-Generation Git Client for Your Terminal',
  meta: [
    {
      name: 'description',
      content: 'A next-generation Git client that runs in your terminal. Built with Bun, OpenTUI, and React for a fast, beautiful, keyboard-first experience.',
    },
    {
      name: 'keywords',
      content: 'git, tui, terminal, git client, bun, opentui, react, typescript, keyboard-first, command line',
    },
  ],
})

useSeoMeta({
  title: 'GitArbor TUI - Next-Generation Git Client for Your Terminal',
  ogTitle: 'GitArbor TUI - Next-Generation Git Client for Your Terminal',
  description: 'A next-generation Git client that runs in your terminal. Built with Bun, OpenTUI, and React for a fast, beautiful, keyboard-first experience.',
  ogDescription: 'A next-generation Git client that runs in your terminal. Built with Bun, OpenTUI, and React for a fast, beautiful, keyboard-first experience.',
  ogType: 'website',
  twitterTitle: 'GitArbor TUI - Next-Generation Git Client for Your Terminal',
  twitterDescription: 'A next-generation Git client that runs in your terminal. Built with Bun, OpenTUI, and React.',
})
</script>

<style scoped>
.hero {
  padding: var(--spacing-2xl) 0;
  background: linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
}

.hero-content {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.hero-title {
  font-size: 4rem;
  line-height: 1.1;
  margin-bottom: var(--spacing-md);
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
}

.hero-cta {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  margin-bottom: var(--spacing-2xl);
}

.btn-large {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1.125rem;
}

.hero-demo {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-screenshot {
  width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hero-screenshot:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
}

.features {
  background: var(--color-bg-secondary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.feature-card {
  text-align: center;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.feature-card h3 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.screenshots {
  background: var(--color-bg-secondary);
}

.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
}

.screenshot-item {
  text-align: center;
}

.screenshot-img {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  margin-bottom: var(--spacing-md);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: var(--shadow-md);
}

.screenshot-img:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.screenshot-item h4 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
  font-size: 1.25rem;
}

.screenshot-item p {
  font-size: 0.95rem;
}

.tech-stack {
  background: var(--color-bg-primary);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
  max-width: 900px;
  margin: 0 auto;
}

.tech-item {
  text-align: center;
}

.tech-logo {
  font-size: 4rem;
  margin-bottom: var(--spacing-sm);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}

.tech-logo-icon {
  width: 64px;
  height: 64px;
  color: var(--color-primary);
  transition: transform 0.3s ease;
}

.tech-item:hover .tech-logo-icon {
  transform: scale(1.1);
}

.tech-item h4 {
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

.cta {
  background: var(--color-bg-secondary);
}

.cta-card {
  max-width: 700px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
  background: linear-gradient(135deg, rgba(204, 136, 68, 0.1) 0%, rgba(187, 119, 51, 0.05) 100%);
}

.cta-buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .hero-cta {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-large {
    width: 100%;
    max-width: 300px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .screenshots-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
