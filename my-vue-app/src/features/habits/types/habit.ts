// src/features/habits/types/habit.ts
export interface Habit {
    id: string
    title: string
    description?: string
    frequency: 'daily' | 'weekly'
    completedDates: string[]  // ISO date strings
    createdAt: string
    streak: number
  }