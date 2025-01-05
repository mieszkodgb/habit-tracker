<!-- src/pages/HabitDashboard.vue -->
<template>
    <div class="max-w-4xl mx-auto">
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
      <DialogContent>
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
  import { PlusIcon } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { Textarea } from '@/components/ui/textarea'
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
  import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
  import { useHabitStore } from '@/stores/habitStore'
  import HabitCard from '@/components/habits/HabitCard.vue'
  
  const habitStore = useHabitStore()
  const showNewHabitDialog = ref(false)
  
  const newHabit = ref({
    title: '',
    description: '',
    frequency: 'daily' as const
  })
  
  const dailyHabits = computed(() => habitStore.dailyHabits)
  const weeklyHabits = computed(() => habitStore.weeklyHabits)
  
  const createHabit = async () => {
    await habitStore.addHabit(newHabit.value)
    showNewHabitDialog.value = false
    newHabit.value = {
      title: '',
      description: '',
      frequency: 'daily'
    }
  }
  
  const toggleHabit = (habitId: string) => {
    console.log("Toggle habit");
    habitStore.toggleCompletion(habitId)
  }
  </script>