<!-- src/pages/HabitsPage.vue -->
<template>
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">My Habits</h1>
        <Button @click="showNewHabitDialog = true">
          Add Habit
        </Button>
      </div>
  
      <div class="grid gap-4">
        <HabitCard 
          v-for="habit in habits" 
          :key="habit.id" 
          :habit="habit"
          @toggle-completion="toggleHabitCompletion"
        />
      </div>
  
      <NewHabitDialog 
        v-model:open="showNewHabitDialog"
        @habit-created="addHabit"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Button } from '@/components/ui/button'
  import { useHabits } from '@/features/habits/stores/useHabits'
  import HabitCard from '@/components/habits/HabitCard.vue'
  import NewHabitDialog from '@/components/habits/NewHabitDialog.vue'
  
  const showNewHabitDialog = ref(false)
  const { habits, addHabit, toggleHabitCompletion } = useHabits()
  </script>