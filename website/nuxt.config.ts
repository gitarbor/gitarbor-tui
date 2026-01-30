export default defineNuxtConfig({
  compatibilityDate: '2025-01-28',

  devtools: { enabled: true },

  modules: ['@nuxtjs/seo', '@nuxt/icon'],

  site: {
    url: 'https://gitarbor.com',
    name: 'GitArbor TUI',
    description:
      'A next-generation Git client that runs in your terminal. Built with Bun, OpenTUI, and React.',
    defaultLocale: 'en',
  },

  ogImage: {
    enabled: false,
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'en',
      },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    },
  },

  css: ['@/assets/css/main.css'],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  nitro: {
    prerender: {
      routes: ['/', '/themes'],
      crawlLinks: true,
    },
  },
});
