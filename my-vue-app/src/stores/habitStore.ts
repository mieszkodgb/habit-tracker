// src/stores/habitStore.ts
import { defineStore } from 'pinia'
import { useNotificationStore } from './notificationStore'

export interface Habit {
  id: string
  title: string
  description?: string
  frequency: 'daily' | 'weekly'
  completedDates: string[] // ISO date strings
  createdAt: string
  streak: number
}

export const useHabitStore = defineStore('habits', {
  state: () => ({
    habits: [] as Habit[],
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    dailyHabits: (state) => state.habits.filter(habit => habit.frequency === 'daily'),
    weeklyHabits: (state) => state.habits.filter(habit => habit.frequency === 'weekly')
  },

  actions: {
    async addHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak'>) {
      const notificationStore = useNotificationStore()
      this.isLoading = true

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        const newHabit: Habit = {
          ...habit,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          completedDates: [],
          streak: 0
        }

        this.habits.push(newHabit)
        notificationStore.success('Habit created successfully!')
      } catch (error) {
        notificationStore.error('Failed to create habit')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async toggleCompletion(habitId: string, date = new Date().toISOString()) {
      const notificationStore = useNotificationStore()
      const habit = this.habits.find(h => h.id === habitId)
      if (!habit) return

      const dateString = date.split('T')[0] // Get just the date part
      const isCompleted = habit.completedDates.includes(dateString)

      if (isCompleted) {
        habit.completedDates = habit.completedDates.filter(d => d !== dateString)
        habit.streak = this.calculateStreak(habit)
        notificationStore.info('Habit marked as incomplete')
      } else {
        habit.completedDates.push(dateString)
        habit.streak = this.calculateStreak(habit)
        notificationStore.success('Habit completed! Keep it up!')

        if (habit.streak > 0 && habit.streak % 7 === 0) {
          notificationStore.success(`🎉 ${habit.streak} day streak! Amazing work!`, 'Streak Achievement')
        }
      }
    },

    calculateStreak(habit: Habit): number {
      let streak = 0
      const today = new Date()
      const sortedDates = [...habit.completedDates].sort()
      
      // For demonstration, just count consecutive days
      for (let i = 0; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i])
        const previousDate = i > 0 ? new Date(sortedDates[i - 1]) : null

        if (!previousDate || this.isConsecutiveDay(previousDate, currentDate)) {
          streak++
        } else {
          streak = 1
        }
      }

      return streak
    },

    isConsecutiveDay(date1: Date, date2: Date): boolean {
      const diffTime = Math.abs(date2.getTime() - date1.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays === 1
    }
  }
})