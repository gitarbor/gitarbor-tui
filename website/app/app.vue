<template>
  <div>
    <SiteHeader />
    <main>
      <NuxtPage />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image',
});

useHead({
  script: [
    {
      src: 'https://media.bitterbrains.com/main.js?from=GITARBOR&type=top',
      async: true,
    },
  ],
});
</script>
