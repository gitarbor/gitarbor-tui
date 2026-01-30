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
</script>
