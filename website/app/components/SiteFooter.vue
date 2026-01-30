<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>GitArbor TUI</h4>
          <p class="text-muted">A next-generation Git client for your terminal.</p>
          <p class="text-muted">Built with Bun, OpenTUI, and React.</p>
        </div>

        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/themes">Themes</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Community</h4>
          <ul class="footer-links">
            <li>
              <a href="https://github.com/cadamsdev/gitarbor-tui" target="_blank" rel="noopener"
                >GitHub</a
              >
            </li>
            <li>
              <a
                href="https://github.com/cadamsdev/gitarbor-tui/issues"
                target="_blank"
                rel="noopener"
                >Issues</a
              >
            </li>
            <li>
              <a
                href="https://github.com/cadamsdev/gitarbor-tui/discussions"
                target="_blank"
                rel="noopener"
                >Discussions</a
              >
            </li>
            <li>
              <a href="https://github.com/sponsors/cadamsdev" target="_blank" rel="noopener"
                >Sponsor</a
              >
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Resources</h4>
          <ul class="footer-links">
            <li><a href="https://bun.sh" target="_blank" rel="noopener">Bun</a></li>
            <li><a href="https://opentui.dev" target="_blank" rel="noopener">OpenTUI</a></li>
            <li><a href="https://react.dev" target="_blank" rel="noopener">React</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="text-muted">
          &copy; {{ new Date().getFullYear() }} GitArbor. Open source under MIT License.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-2xl) 0 var(--spacing-lg);
  margin-top: var(--spacing-2xl);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.footer-section h4 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1.125rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: var(--spacing-xs);
}

.footer-links a {
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}
</style>
