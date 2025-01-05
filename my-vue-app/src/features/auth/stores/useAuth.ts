// src/features/auth/stores/useAuth.ts
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth'

export function useAuth() {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (credentials: LoginCredentials) => {
    // TODO: Replace with actual API call
    user.value = {
      id: '1',
      email: credentials.email,
      name: 'Test User',
      plan: 'free'
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    // TODO: Replace with actual API call
    user.value = {
      id: '1',
      email: credentials.email,
      name: credentials.name,
      plan: 'free'
    }
  }

  const logout = () => {
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout
  }
}