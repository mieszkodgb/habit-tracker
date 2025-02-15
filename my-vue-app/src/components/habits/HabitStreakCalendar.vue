<!-- src/components/habits/UnifiedHabitCalendar.vue -->
<template>
    <Card class="w-full">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-xl">Habit Calendar</CardTitle>
          <div class="flex items-center gap-4">
            <Select v-model="selectedMonth">
              <SelectTrigger class="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem 
                  v-for="month in availableMonths" 
                  :key="month.value" 
                  :value="month.value"
                >
                  {{ month.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" @click="today">
              <CalendarDays class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
  
      <CardContent>
        <!-- Calendar Grid -->
        <div class="space-y-6">
          <!-- Weekday headers -->
          <div class="grid grid-cols-8 gap-2">
            <div class="col-span-1"></div> <!-- Empty cell for habit names -->
            <div
              v-for="day in weekDays"
              :key="day"
              class="text-center text-sm text-muted-foreground font-medium"
            >
              {{ day }}
            </div>
          </div>
  
          <!-- Calendar body -->
          <div class="space-y-2">
            <!-- Row for each habit -->
            <div
              v-for="habit in habits"
              :key="habit.id"
              class="grid grid-cols-8 gap-2 items-center"
            >
              <!-- Habit name -->
              <div class="truncate text-sm" :title="habit.title">
                {{ habit.title }}
              </div>
  
              <!-- Days -->
              <Button
                v-for="day in calendarDays"
                :key="`${habit.id}-${day.date}`"
                variant="ghost"
                size="sm"
                :class="[
                  'h-8 w-full relative',
                  getDayClass(habit, day),
                  isToday(day.date) ? 'ring-1 ring-primary' : ''
                ]"
                :disabled="!canToggleDate(day.date)"
                @click="toggleHabitCompletion(habit, day.date)"
              >
                <span class="text-xs">{{ day.date.getDate() }}</span>
                <HoverCard v-if="canToggleDate(day.date)">
                  <HoverCardTrigger>
                    <span class="absolute inset-0" />
                  </HoverCardTrigger>
                  <HoverCardContent class="w-48">
                    <div class="space-y-2">
                      <p class="text-sm font-medium">{{ habit.title }}</p>
                      <p class="text-xs text-muted-foreground">
                        {{ formatDate(day.date) }}
                      </p>
                      <p class="text-xs">
                        {{ isHabitCompleted(habit, day.date) ? 'Completed' : 'Not completed' }}
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </Button>
            </div>
          </div>
  
          <!-- Legend -->
          <div class="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div class="flex items-center gap-2">
              <div class="h-3 w-3 rounded-sm bg-primary/20" />
              <span>Not Completed</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-3 w-3 rounded-sm bg-primary" />
              <span>Completed</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
              <span>Future</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { CalendarDays } from 'lucide-vue-next'
  import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
  } from '@/components/ui/card'
  import { Button } from '@/components/ui/button'
  import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
  } from '@/components/ui/select'
  import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from '@/components/ui/hover-card'
  import type { Habit} from '@/features/habits/types/habit'

  const props = defineProps<{
    habits: Habit[]
  }>()

  const emit = defineEmits<{
    (e: 'toggle-completion', payload: { habitId: string, date: string }): void
  }>()
  
  // Calendar state
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const selectedMonth = ref(new Date().toISOString().slice(0, 7))
  
  // Computed properties
  const availableMonths = computed(() => {
    const months = []
    const currentDate = new Date()
    
    // Show last 6 months and next 6 months
    for (let i = -6; i <= 6; i++) {
      const date = new Date(currentDate)
      date.setMonth(currentDate.getMonth() + i)
      months.push({
        value: date.toISOString().slice(0, 7),
        label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      })
    }
    
    return months
  })
  
  const calendarDays = computed(() => {
    const [year, month] = selectedMonth.value.split('-')
    const firstDay = new Date(Number(year), Number(month) - 1, 1)
    const lastDay = new Date(Number(year), Number(month), 0)
    const days = []
  
    // Add days from previous month
    const firstDayOfWeek = firstDay.getDay()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(firstDay)
      date.setDate(-i)
      days.push({ date, isCurrentMonth: false })
    }
  
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(Number(year), Number(month) - 1, i)
      days.push({ date, isCurrentMonth: true })
    }
  
    // Add days from next month if needed
    const remainingDays = 35 - days.length // 5 rows * 7 days
    if (remainingDays > 0) {
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(Number(year), Number(month), i)
        days.push({ date, isCurrentMonth: false })
      }
    }
  
    return days
  })
  
  // Methods
  function isHabitCompleted(habit: Habit, date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0]
    return habit.completedDates.includes(dateStr)
  }
  
  function getDayClass(habit: Habit, day: { date: Date; isCurrentMonth: boolean }): string {
    if (!day.isCurrentMonth) return 'opacity-30'
    if (!canToggleDate(day.date)) return 'bg-gray-100 dark:bg-gray-800'
    return isHabitCompleted(habit, day.date) 
      ? 'bg-primary hover:bg-primary/90' 
      : 'bg-primary/20 hover:bg-primary/30'
  }
  
  function canToggleDate(date: Date): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date <= today
  }
  
  function isToday(date: Date): boolean {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }
  
  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  function toggleHabitCompletion(habit: Habit, date: Date) {
    emit('toggle-completion', {
      habitId: habit.id,
      date: date.toISOString()
    })
  }
  
  function today() {
    selectedMonth.value = new Date().toISOString().slice(0, 7)
  }
  </script>