<!-- src/components/habits/NewHabitDialog.vue -->
<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Habit</DialogTitle>
        <DialogDescription>
          Add a new habit to track. Make it specific and achievable.
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4 py-4">
          <!-- Title and Description fields remain the same -->
          <div class="grid gap-2">
            <Label for="title">Title</Label>
            <Input id="title" v-model="form.title" placeholder="Exercise for 30 minutes" />
          </div>
          <div class="grid gap-2">
            <Label for="description">Description</Label>
            <Textarea 
              id="description" 
              v-model="form.description" 
              placeholder="Daily workout routine..."
            />
          </div>

          <!-- Icon Selection -->
          <div class="grid gap-2">
            <Label for="icon">Icon</Label>
            <Select v-model="form.icon">
              <SelectTrigger>
                <SelectValue>
                  <div class="flex items-center gap-2">
                    <component 
                      v-if="form.icon" 
                      :is="icons[form.icon]" 
                      class="w-4 h-4" 
                    />
                    {{ form.icon || 'Select icon' }}
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
          <div class="grid gap-2">
            <Label for="priority">Priority</Label>
            <Select v-model="form.priority">
              <SelectTrigger>
                <SelectValue>
                  <div class="flex items-center gap-2">
                    <div 
                      v-if="form.priority"
                      class="w-2 h-2 rounded-full" 
                      :class="{
                        'bg-gray-400': form.priority === 'low',
                        'bg-blue-400': form.priority === 'medium',
                        'bg-red-400': form.priority === 'high'
                      }"
                    />
                    {{ form.priority || 'Select priority' }}
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

          <!-- Frequency Selection -->
          <div class="grid gap-2">
            <Label for="frequency">Frequency</Label>
            <Select v-model="form.frequency">
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Habit</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dumbbell, Brain, Book, Heart, Music, Pencil, Coffee, Trophy } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { HabitPriority, HabitIcon } from '@/features/habits/types/habit'

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
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'habit-created', habit: {
    title: string
    description?: string
    frequency: 'daily' | 'weekly'
    icon?: HabitIcon
    priority?: HabitPriority
  }): void
}>()

const form = ref({
  title: '',
  description: '',
  frequency: 'daily' as const,
  icon: undefined as HabitIcon | undefined,
  priority: undefined as HabitPriority | undefined,
})

const handleSubmit = () => {
  emit('habit-created', { ...form.value })
  form.value = {
    title: '',
    description: '',
    frequency: 'daily',
    icon: undefined,
    priority: undefined,
  }
  emit('update:open', false)
}
</script>