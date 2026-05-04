<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <nav>
      <RouterLink to="/">首頁</RouterLink>
      <RouterLink to="/about">關於</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
.app-header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

nav {
  display: flex;
  gap: 1rem;
  justify-content: center;
  font-size: 0.95rem;
}

nav a.router-link-exact-active {
  font-weight: 600;
  color: var(--color-text);
}

nav a {
  color: var(--color-text);
  text-decoration: none;
  opacity: 0.85;
}

nav a:hover {
  opacity: 1;
}
</style>
