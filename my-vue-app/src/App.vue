<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-background">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
    <ToastProvider />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import ToastProvider from '@/components/common/ToastProvider.vue'
</script>