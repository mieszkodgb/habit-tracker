// src/features/auth/stores/authStore.ts
import { defineStore } from 'pinia'
import { useNotificationStore } from '@/stores/notificationStore'
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isLoading: false,
    error: null as string | null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  
  actions: {
    async login(credentials: LoginCredentials) {
      const notificationStore = useNotificationStore()
      this.isLoading = true
      this.error = null
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // TODO: Replace with actual API call
        this.user = {
          id: '1',
          email: credentials.email,
          name: 'Test User',
          plan: 'free'
        }
        notificationStore.success('Successfully logged in!')
      } catch (error) {
        this.error = 'Invalid email or password'
        notificationStore.error('Login failed. Please check your credentials.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(credentials: RegisterCredentials) {
        const notificationStore = useNotificationStore()
        this.isLoading = true
        this.error = null
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          this.user = {
            id: '1',
            email: credentials.email,
            name: credentials.name,
            plan: 'free'
          }
          notificationStore.success('Account created successfully!')
        } catch (error) {
          this.error = 'Registration failed. Please try again.'
          notificationStore.error('Failed to create account. Please try again.')
          throw error
        } finally {
          this.isLoading = false
        }
    },

    logout() {
      const notificationStore = useNotificationStore()
      this.user = null
      this.error = null
      notificationStore.info('You have been logged out')
    }
  }
})