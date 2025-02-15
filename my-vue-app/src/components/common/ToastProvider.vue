<!-- src/components/common/ToastProvider.vue -->
<template>
    <ToastProvider>
        <template v-for="notification in notifications" :key="notification.id">
        <Toast>
            <div class="flex items-center gap-2">
            <component 
                :is="getIcon(notification.type)" 
                class="h-4 w-4"
                :class="getIconClass(notification.type)" 
            />
            <ToastTitle>{{ notification.title }}</ToastTitle>
            </div>
            <ToastDescription>
            {{ notification.message }}
            </ToastDescription>
            <ToastClose />
        </Toast>
        </template>
      <ToastViewport />
    </ToastProvider>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast'
  import { CheckCircleIcon, XCircleIcon, AlertCircleIcon, InfoIcon } from 'lucide-vue-next'
  import { useNotificationStore } from '@/stores/notificationStore'
  import type { NotificationType } from '@/stores/notificationStore'
  
  const notificationStore = useNotificationStore()
  const notifications = computed(() => notificationStore.notifications)
  
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return CheckCircleIcon
      case 'error':
        return XCircleIcon
      case 'warning':
        return AlertCircleIcon
      case 'info':
        return InfoIcon
    }
  }
  
  const getIconClass = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-500'
      case 'info':
        return 'text-blue-500'
    }
  }
  </script>