// src/features/habits/types/habit.ts
export type HabitPriority = 'low' | 'medium' | 'high'
export type HabitIcon = 'Dumbbell' | 'Brain' | 'Book' | 'Heart' | 'Music' | 'Pencil' | 'Coffee' | 'Trophy'

export interface Habit {
    id: string
    title: string
    description?: string
    frequency: 'daily' | 'weekly'
    completedDates: string[]  // ISO date strings
    createdAt: string
    streak: number
    // New fields
    priority?: HabitPriority
    icon?: HabitIcon
}