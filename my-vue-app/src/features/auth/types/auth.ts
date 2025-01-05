// src/features/auth/types/auth.ts
export interface User {
    id: string
    email: string
    name: string
    plan: 'free' | 'premium'
  }
  
  export interface LoginCredentials {
    email: string
    password: string
  }
  
  export interface RegisterCredentials extends LoginCredentials {
    name: string
  }