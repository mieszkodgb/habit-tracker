// src/features/habits/stores/useHabits.ts
import { ref, computed } from 'vue'
import type { Habit } from '../types/habit'

export function useHabits() {
  const habits = ref<Habit[]>([])

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'completedDates'>) => {
    habits.value.push({
      ...habit,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      streak: 0,
      completedDates: []
    })
  }

  const toggleHabitCompletion = (habitId: string, date: string = new Date().toISOString()) => {
    const habit = habits.value.find(h => h.id === habitId)
    if (!habit) return

    const dateIndex = habit.completedDates.indexOf(date)
    if (dateIndex === -1) {
      habit.completedDates.push(date)
    } else {
      habit.completedDates.splice(dateIndex, 1)
    }
  }

  return {
    habits,
    addHabit,
    toggleHabitCompletion
  }
}