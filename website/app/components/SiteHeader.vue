<template>
  <header class="site-header">
    <div class="container">
      <nav class="nav">
        <NuxtLink to="/" class="logo">
          <img src="/logo.svg" alt="GitArbor Logo" class="logo-icon" />
          <span class="logo-text">GitArbor</span>
        </NuxtLink>

        <div class="nav-links">
          <NuxtLink to="/themes" class="nav-link">Themes</NuxtLink>
          <a
            href="https://github.com/cadamsdev/gitarbor-tui"
            target="_blank"
            rel="noopener"
            class="nav-link"
          >
            <span class="github-icon">⭐</span> GitHub
          </a>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background-color: rgba(26, 26, 26, 0.8);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.05);
  color: var(--color-text-primary);
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  display: block;
}

.logo-text {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
}

.nav-link {
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link:hover {
  color: var(--color-primary);
}

.github-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .nav-links {
    gap: var(--spacing-md);
  }

  .nav-link {
    font-size: 0.9rem;
  }
}
</style>
