# GitArbor TUI - Marketing Website

This is the marketing website for GitArbor TUI, built with Nuxt 4, Vue 3, and TypeScript.

## Tech Stack

- **Bun**: Fast JavaScript runtime and package manager
- **Nuxt 4**: Vue.js meta-framework for production-ready apps
- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe JavaScript
- **@nuxtjs/seo**: SEO optimization for Nuxt

## Development

### Prerequisites

- [Bun](https://bun.sh) v1.3.6 or higher

### Install Dependencies

```bash
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

### Build for Production

Build the application for production:

```bash
bun run build
```

### Generate Static Site

Generate a static version of the site:

```bash
bun run generate
```

This will create a static site in the `.output/public` directory that can be deployed to any static hosting service.

### Preview Production Build

Preview the production build locally:

```bash
bun run preview
```

### Type Checking

Run TypeScript type checking:

```bash
bun run typecheck
```

## Project Structure

```
website/
├── nuxt.config.ts         # Nuxt configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
└── app/                   # App directory (Nuxt 4)
    ├── app.vue            # Main app component
    ├── assets/
    │   └── css/
    │       └── main.css   # Global styles with theme variables
    ├── components/
    │   ├── SiteHeader.vue # Navigation header
    │   └── SiteFooter.vue # Footer with links
    └── pages/
        ├── index.vue      # Home page
        ├── themes.vue     # Themes showcase
        └── docs/
            ├── index.vue  # Documentation overview
            ├── installation.vue
            └── usage.vue
```

## Theme

The website theme matches the GitArbor TUI default dark theme:
- Primary color: `#CC8844` (orange)
- Dark backgrounds with terminal aesthetics
- Monospace fonts for code examples
- Git status colors matching the TUI

## SEO Optimization

The site is optimized for search engines with:
- Meta tags for title, description, and keywords
- OpenGraph tags for social media sharing
- Twitter Card support
- Sitemap generation
- Prerendered routes for fast loading

## Deployment

### Static Hosting

After running `bun run generate`, deploy the `.output/public` directory to:
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages
- Any static hosting service

### Server Hosting

After running `bun run build`, deploy the `.output` directory to:
- Netlify (with Nuxt preset)
- Vercel (with Nuxt preset)
- Node.js hosting
- Any hosting that supports Nitro server

## License

MIT - Same as GitArbor TUI
