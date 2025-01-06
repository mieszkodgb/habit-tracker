<!-- src/pages/HabitDashboard.vue -->
<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">My Habits</h1>
        <p class="text-muted-foreground">Track your daily and weekly habits</p>
      </div>
      <Button @click="showNewHabitDialog = true">
        <PlusIcon class="h-4 w-4 mr-2" />
        Add Habit
      </Button>
    </div>
    <HabitStats class="mb-8" />

    <Tabs default-value="daily" class="mb-8">
      <TabsList>
        <TabsTrigger value="daily">Daily Habits</TabsTrigger>
        <TabsTrigger value="weekly">Weekly Habits</TabsTrigger>
      </TabsList>

      <TabsContent value="daily">
        <div class="grid gap-4">
          <HabitCard 
            v-for="habit in dailyHabits" 
            :key="habit.id" 
            :habit="habit"
            @toggle-completion="toggleHabit"
          />
        </div>
      </TabsContent>
      <TabsContent value="weekly">
        <div class="grid gap-4">
          <HabitCard 
            v-for="habit in weeklyHabits" 
            :key="habit.id" 
            :habit="habit"
            @toggle-completion="toggleHabit"
          />
        </div>
      </TabsContent>
    </Tabs>
  </div>

  <Dialog v-model:open="showNewHabitDialog">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Habit</DialogTitle>
        <DialogDescription>
          Add a new habit to track. Make it specific and achievable.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="createHabit" class="space-y-4">
        <div class="space-y-2">
          <Label for="title">Title</Label>
          <Input id="title" v-model="newHabit.title" placeholder="Exercise for 30 minutes" required />
        </div>

        <div class="space-y-2">
          <Label for="description">Description (Optional)</Label>
          <Textarea 
            id="description" 
            v-model="newHabit.description" 
            placeholder="Daily workout routine to stay healthy"
          />
        </div>

        <!-- Icon Selection -->
        <div class="space-y-2">
          <Label for="icon">Icon</Label>
          <Select v-model="newHabit.icon">
            <SelectTrigger>
              <SelectValue>
                <div class="flex items-center gap-2">
                  <component 
                    v-if="newHabit.icon" 
                    :is="icons[newHabit.icon]" 
                    class="w-4 h-4" 
                  />
                  {{ newHabit.icon || 'Select icon' }}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem 
                v-for="[name, icon] in Object.entries(icons)" 
                :key="name" 
                :value="name"
              >
                <div class="flex items-center gap-2">
                  <component :is="icon" class="w-4 h-4" />
                  {{ name }}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Priority Selection -->
        <div class="space-y-2">
          <Label for="priority">Priority</Label>
          <Select v-model="newHabit.priority">
            <SelectTrigger>
              <SelectValue>
                <div class="flex items-center gap-2">
                  <div 
                    v-if="newHabit.priority"
                    class="w-2 h-2 rounded-full" 
                    :class="{
                      'bg-gray-400': newHabit.priority === 'low',
                      'bg-blue-400': newHabit.priority === 'medium',
                      'bg-red-400': newHabit.priority === 'high'
                    }"
                  />
                  {{ newHabit.priority || 'Select priority' }}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-gray-400" />
                  Low
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-blue-400" />
                  Medium
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-red-400" />
                  High
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <Label for="frequency">Frequency</Label>
          <Select v-model="newHabit.frequency">
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button type="submit">Create Habit</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusIcon, Dumbbell, Brain, Book, Heart, Music, Pencil, Coffee, Trophy } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useHabitStore } from '@/stores/habitStore'
import HabitCard from '@/components/habits/HabitCard.vue'
import HabitStats from '@/components/habits/HabitStats.vue'
import type { HabitPriority, HabitIcon } from '@/features/habits/types/habit'

const habitStore = useHabitStore()
const showNewHabitDialog = ref(false)

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

const newHabit = ref({
  title: '',
  description: '',
  frequency: 'daily' as const,
  icon: undefined as HabitIcon | undefined,
  priority: undefined as HabitPriority | undefined,
})

const dailyHabits = computed(() => habitStore.dailyHabits)
const weeklyHabits = computed(() => habitStore.weeklyHabits)

const createHabit = async () => {
  await habitStore.addHabit(newHabit.value)
  showNewHabitDialog.value = false
  newHabit.value = {
    title: '',
    description: '',
    frequency: 'daily',
    icon: undefined,
    priority: undefined,
  }
}

const toggleHabit = (habitId: string) => {
  habitStore.toggleCompletion(habitId)
}
</script>