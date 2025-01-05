<!-- src/pages/HomePage.vue -->
<template>
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-4xl font-bold mb-4">Track Your Habits</h1>
      <p class="text-muted-foreground mb-8">
        Build better habits and track your progress over time.
      </p>
      <div class="flex justify-center gap-4">
        <Button size="lg" @click="router.push('/habits')">
          Get Started
        </Button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Button } from '@/components/ui/button'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  </script>