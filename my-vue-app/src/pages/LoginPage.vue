<!-- src/pages/LoginPage.vue -->
<template>
  <div class="max-w-md mx-auto mt-16">
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Show error alert if there's an error -->
          <Alert variant="destructive" v-if="authStore.error">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {{ authStore.error }}
            </AlertDescription>
          </Alert>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="john@example.com"
              required
              :disabled="authStore.isLoading"
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              required
              :disabled="authStore.isLoading"
            />
          </div>
          <Button 
            type="submit" 
            class="w-full"
            :disabled="authStore.isLoading"
          >
            <template v-if="authStore.isLoading">
              <span class="mr-2">
                <Loader2Icon class="h-4 w-4 animate-spin" />
              </span>
              Logging in...
            </template>
            <template v-else>
              Login
            </template>
          </Button>
        </form>
      </CardContent>
      <CardFooter class="flex justify-center">
        <RouterLink 
          to="/register" 
          class="text-sm text-muted-foreground hover:underline"
        >
          Don't have an account? Register
        </RouterLink>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
  email: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    await authStore.login(form.value)
    router.push('/habits')
  } catch (error) {
    // Error is already handled in the store
    console.error('Login failed:', error)
  }
}
</script>