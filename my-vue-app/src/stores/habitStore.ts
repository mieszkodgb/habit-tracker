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
  longestStreak: number
  lastChecked?: string
}

// Helper functions
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

export const useHabitStore = defineStore('habits', {
  state: () => ({
    habits: [] as Habit[],
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    dailyHabits: (state) => state.habits.filter(habit => habit.frequency === 'daily'),
    weeklyHabits: (state) => state.habits.filter(habit => habit.frequency === 'weekly'),
    
    completionRate: (state) => {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return getDateString(date)
      })

      const dailyPossible = state.habits.filter(h => h.frequency === 'daily').length * 7
      const weeklyPossible = state.habits.filter(h => h.frequency === 'weekly').length

      const completed = state.habits.reduce((total, habit) => {
        return total + habit.completedDates.filter(date => last7Days.includes(date)).length
      }, 0)

      const totalPossible = dailyPossible + weeklyPossible
      return totalPossible ? Math.round((completed / totalPossible) * 100) : 0
    }
  },

  actions: {
    async initialize() {
      // Load habits from localStorage
      const stored = localStorage.getItem('habits')
      if (stored) {
        this.habits = JSON.parse(stored)
      }
      
      // Check for missed habits and update streaks
      await this.checkMissedHabits()
    },

    async addHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak' | 'longestStreak'>) {
      const notificationStore = useNotificationStore()
      this.isLoading = true

      try {
        const newHabit: Habit = {
          ...habit,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          completedDates: [],
          streak: 0,
          longestStreak: 0,
          lastChecked: new Date().toISOString()
        }

        this.habits.push(newHabit)
        this.saveToStorage()
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

      const dateString = getDateString(new Date(date))
      const isCompleted = habit.completedDates.includes(dateString)

      if (isCompleted) {
        habit.completedDates = habit.completedDates.filter(d => d !== dateString)
      } else {
        habit.completedDates.push(dateString)
      }

      // Update streak
      const newStreak = this.calculateStreak(habit)
      const streakIncreased = newStreak > habit.streak
      habit.streak = newStreak
      habit.longestStreak = Math.max(habit.longestStreak, newStreak)

      // Save changes
      this.saveToStorage()

      // Show appropriate notification
      if (isCompleted) {
        notificationStore.info('Habit marked as incomplete')
      } else {
        notificationStore.success('Habit completed! Keep it up!')
        if (streakIncreased && habit.streak % 7 === 0) {
          notificationStore.success(`🎉 ${habit.streak} day streak! Amazing work!`, 'Streak Achievement')
        }
      }
    },

    calculateStreak(habit: Habit): number {
      if (habit.completedDates.length === 0) return 0

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const sortedDates = [...habit.completedDates]
        .map(date => new Date(date))
        .sort((a, b) => b.getTime() - a.getTime())

      if (habit.frequency === 'daily') {
        let streak = 0
        let currentDate = today

        // Check if we've completed today
        const todayCompleted = sortedDates.some(date => isSameDay(date, today))
        if (!todayCompleted) {
          // Check if we completed yesterday
          const yesterday = addDays(today, -1)
          if (!sortedDates.some(date => isSameDay(date, yesterday))) {
            return 0
          }
          currentDate = yesterday
        }

        // Count consecutive days
        for (const date of sortedDates) {
          if (isSameDay(currentDate, date) || isSameDay(addDays(currentDate, -1), date)) {
            streak++
            currentDate = date
          } else {
            break
          }
        }

        return streak
      } else {
        // Weekly habits
        let streak = 0
        const oneWeek = 7 * 24 * 60 * 60 * 1000
        let lastDate = today.getTime()

        for (const date of sortedDates) {
          const timeDiff = Math.abs(lastDate - date.getTime())
          if (timeDiff <= oneWeek) {
            streak++
            lastDate = date.getTime()
          } else {
            break
          }
        }

        return streak
      }
    },

    async checkMissedHabits() {
      const notificationStore = useNotificationStore()
      const today = new Date()
      const yesterday = addDays(today, -1)
      const yesterdayString = getDateString(yesterday)

      for (const habit of this.habits) {
        if (habit.frequency === 'daily' && !habit.completedDates.includes(yesterdayString)) {
          // Only notify if we haven't already checked today
          if (!habit.lastChecked || !isSameDay(new Date(habit.lastChecked), today)) {
            notificationStore.warning(
              `You missed your habit: ${habit.title}`,
              'Missed Habit'
            )
            // Here you would trigger email notification
            await this.sendMissedHabitEmail(habit)
          }
        }

        // Update last checked
        habit.lastChecked = today.toISOString()
      }

      this.saveToStorage()
    },

    async sendMissedHabitEmail(habit: Habit) {
      // TODO: Implement email notification
      console.log(`Would send email for missed habit: ${habit.title}`)
    },

    saveToStorage() {
      localStorage.setItem('habits', JSON.stringify(this.habits))
    },

    deleteHabit(habitId: string) {
      const notificationStore = useNotificationStore()
      const index = this.habits.findIndex(h => h.id === habitId)
      
      if (index !== -1) {
        this.habits.splice(index, 1)
        this.saveToStorage()
        notificationStore.success('Habit deleted successfully')
      }
    }
  }
})