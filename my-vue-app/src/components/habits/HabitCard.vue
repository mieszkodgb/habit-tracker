<!-- src/components/habits/HabitCard.vue -->
<template>
    <Card class="w-full">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>{{ habit.title }}</CardTitle>
          <Checkbox 
            :checked="isCompletedToday"
            @update:checked="$emit('toggle-completion', habit.id)"
          />
        </div>
        <CardDescription>{{ habit.description }}</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex items-center gap-2">
          <Badge>{{ habit.frequency }}</Badge>
          <Badge variant="secondary">
            Streak: {{ habit.streak }} days
          </Badge>
        </div>
      </CardContent>
    </Card>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import type { Habit } from '@/features/habits/types/habit'
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
  import { Badge } from '@/components/ui/badge'
  import { Checkbox } from '@/components/ui/checkbox'
  
  const props = defineProps<{
    habit: Habit
  }>()
  
  defineEmits<{
    (e: 'toggle-completion', id: string): void
  }>()
  
  const isCompletedToday = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return props.habit.completedDates.some(date => date.startsWith(today))
  })
  </script>