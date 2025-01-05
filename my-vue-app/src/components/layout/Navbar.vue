<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/features/auth/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="border-b">
    <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <RouterLink to="/" class="text-xl font-bold">
          HabitTracker
        </RouterLink>
      </div>
      <div class="flex items-center space-x-4">
        <template v-if="authStore.isAuthenticated">
          <DropdownMenu>
            <DropdownMenuTrigger as="div">
              <Button variant="ghost">{{ authStore.user?.name }}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem @click="handleLogout">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>
        <template v-else>
          <RouterLink to="/login">
            <Button variant="outline" size="sm">Login</Button>
          </RouterLink>
          <RouterLink to="/register">
            <Button size="sm">Sign Up</Button>
          </RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>