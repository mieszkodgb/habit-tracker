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
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { Button } from '@/components/ui/button'
  import { Textarea } from '@/components/ui/textarea'
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
  
  const props = defineProps<{
    open: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'habit-created', habit: { title: string; description?: string; frequency: 'daily' | 'weekly' }): void
  }>()
  
  const form = ref({
    title: '',
    description: '',
    frequency: 'daily' as const
  })
  
  const handleSubmit = () => {
    emit('habit-created', { ...form.value })
    form.value = {
      title: '',
      description: '',
      frequency: 'daily'
    }
    emit('update:open', false)
  }
  </script>