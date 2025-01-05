<!-- src/components/habits/HabitStats.vue -->
<template>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Habits</CardTitle>
          <BookMarked class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ totalHabits }}</div>
          <p class="text-xs text-muted-foreground">
            {{ dailyHabits }} daily, {{ weeklyHabits }} weekly
          </p>
        </CardContent>
      </Card>
  
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Completion Rate</CardTitle>
          <BarChart class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ completionRate }}%</div>
          <p class="text-xs text-muted-foreground">
            Last 7 days
          </p>
        </CardContent>
      </Card>
  
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Longest Streak</CardTitle>
          <Flame class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ longestStreak }}</div>
          <p class="text-xs text-muted-foreground">
            {{ currentStreak }} current streak
          </p>
        </CardContent>
      </Card>
  
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Next Milestone</CardTitle>
          <Target class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ nextMilestone }} days</div>
          <Progress :value="milestoneProgress" class="mt-2" />
        </CardContent>
      </Card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import { Progress } from '@/components/ui/progress'
  import { BookMarked, BarChart, Flame, Target } from 'lucide-vue-next'
  import { useHabitStore } from '@/stores/habitStore'
  
  const habitStore = useHabitStore()
  
  const totalHabits = computed(() => habitStore.habits.length)
  const dailyHabits = computed(() => habitStore.dailyHabits.length)
  const weeklyHabits = computed(() => habitStore.weeklyHabits.length)
  
  const completionRate = computed(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    })
  
    const completedCount = habitStore.habits.reduce((acc, habit) => {
      const completedInLast7Days = habit.completedDates.filter(date => 
        last7Days.includes(date)
      ).length
      return acc + completedInLast7Days
    }, 0)
  
    const totalPossible = habitStore.dailyHabits.length * 7 + 
      habitStore.weeklyHabits.length
  
    return totalPossible ? Math.round((completedCount / totalPossible) * 100) : 0
  })
  
  const longestStreak = computed(() => 
    Math.max(...habitStore.habits.map(h => h.streak))
  )
  
  const currentStreak = computed(() => 
    habitStore.habits.reduce((acc, habit) => acc + habit.streak, 0)
  )
  
  const nextMilestone = computed(() => {
    const milestones = [7, 14, 30, 60, 90]
    return milestones.find(m => m > longestStreak.value) ?? milestones[0]
  })
  
  const milestoneProgress = computed(() => 
    (longestStreak.value / nextMilestone.value) * 100
  )
  </script>