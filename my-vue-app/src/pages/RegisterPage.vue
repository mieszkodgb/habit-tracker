<!-- src/pages/RegisterPage.vue -->
<template>
  <div class="max-w-md mx-auto mt-16">
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Create a new account to start tracking your habits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Error Alert -->
          <Alert variant="destructive" v-if="authStore.error">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {{ authStore.error }}
            </AlertDescription>
          </Alert>

          <!-- Name Field -->
          <div class="space-y-2">
            <Label for="name">Name</Label>
            <Input
              id="name"
              v-model="form.name"
              type="text"
              :disabled="authStore.isLoading"
              @blur="validateField('name')"
            />
            <p class="text-sm text-destructive" v-if="errors.name">
              {{ errors.name }}
            </p>
          </div>

          <!-- Email Field -->
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              :disabled="authStore.isLoading"
              @blur="validateField('email')"
            />
            <p class="text-sm text-destructive" v-if="errors.email">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              :disabled="authStore.isLoading"
              @blur="validateField('password')"
            />
            <p class="text-sm text-destructive" v-if="errors.password">
              {{ errors.password }}
            </p>
          </div>

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              :disabled="authStore.isLoading"
              @blur="validateField('confirmPassword')"
            />
            <p class="text-sm text-destructive" v-if="errors.confirmPassword">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <Button 
            type="submit" 
            class="w-full"
            :disabled="authStore.isLoading || !isFormValid"
          >
            <template v-if="authStore.isLoading">
              <span class="mr-2">
                <Loader2Icon class="h-4 w-4 animate-spin" />
              </span>
              Creating account...
            </template>
            <template v-else>
              Create Account
            </template>
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex justify-center">
        <RouterLink 
          to="/login" 
          class="text-sm text-muted-foreground hover:underline"
        >
          Already have an account? Login
        </RouterLink>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Loader2Icon } from 'lucide-vue-next'
import { useAuthStore } from '@/features/auth/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Validation rules
const validateField = (field: keyof typeof form.value) => {
  errors.value[field] = ''

  switch (field) {
    case 'name':
      if (!form.value.name) {
        errors.value.name = 'Name is required'
      } else if (form.value.name.length < 2) {
        errors.value.name = 'Name must be at least 2 characters'
      }
      break

    case 'email':
      if (!form.value.email) {
        errors.value.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = 'Please enter a valid email'
      }
      break

    case 'password':
      if (!form.value.password) {
        errors.value.password = 'Password is required'
      } else if (form.value.password.length < 8) {
        errors.value.password = 'Password must be at least 8 characters'
      } else if (!/(?=.*[A-Z])/.test(form.value.password)) {
        errors.value.password = 'Password must contain at least one uppercase letter'
      } else if (!/(?=.*[0-9])/.test(form.value.password)) {
        errors.value.password = 'Password must contain at least one number'
      }
      break

    case 'confirmPassword':
      if (!form.value.confirmPassword) {
        errors.value.confirmPassword = 'Please confirm your password'
      } else if (form.value.password !== form.value.confirmPassword) {
        errors.value.confirmPassword = 'Passwords do not match'
      }
      break
  }
}

// Validate all fields
const validateForm = () => {
  Object.keys(form.value).forEach(field => {
    validateField(field as keyof typeof form.value)
  })
}

// Check if form is valid
const isFormValid = computed(() => {
  return Object.values(errors.value).every(error => !error) &&
         Object.values(form.value).every(value => value)
})

const handleSubmit = async () => {
  validateForm()

  if (!isFormValid.value) return

  try {
    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })
    router.push('/habits')
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>