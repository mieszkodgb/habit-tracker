<!-- src/components/habits/HabitCard.vue -->
<template>
  <Card class="w-full">
    <CardHeader>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Icon -->
          <component 
            v-if="habit.icon" 
            :is="icons[habit.icon]" 
            class="w-5 h-5"
          />
          <div>
            <CardTitle>{{ habit.title }}</CardTitle>
            <CardDescription>{{ habit.description }}</CardDescription>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <!-- Priority indicator -->
          <div 
            v-if="habit.priority"
            class="flex items-center gap-2"
          >
            <span 
              class="w-2 h-2 rounded-full"
              :class="{
                'bg-gray-400': habit.priority === 'low',
                'bg-blue-400': habit.priority === 'medium',
                'bg-red-400': habit.priority === 'high'
              }"
            />
          </div>
          <Checkbox 
            :checked="isCompletedToday"
            @update:checked="$emit('toggle-completion', habit.id)"
          />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="flex items-center gap-2">
        <Badge>{{ habit.frequency }}</Badge>
        <Badge variant="secondary">
          Streak: {{ habit.streak }} days
        </Badge>
        <Badge 
          v-if="habit.priority"
          :variant="priorityVariant"
        >
          {{ habit.priority }}
        </Badge>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dumbbell, Brain, Book, Heart, Music, Pencil, Coffee, Trophy } from 'lucide-vue-next'
import type { Habit } from '@/features/habits/types/habit'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

const icons = {
  Dumbbell,
  Brain,
  Book,
  Heart,
  Music,
  Pencil,
  Coffee,
  Trophy,
}

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

const priorityVariant = computed(() => {
  switch (props.habit.priority) {
    case 'low': return 'outline'
    case 'medium': return 'secondary'
    case 'high': return 'destructive'
    default: return 'outline'
  }
})
</script>