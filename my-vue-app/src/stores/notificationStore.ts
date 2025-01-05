// src/stores/notificationStore.ts
import { defineStore } from 'pinia'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  duration?: number // in milliseconds
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[]
  }),

  actions: {
    add(notification: Omit<Notification, 'id'>) {
      const id = crypto.randomUUID()
      const duration = notification.duration ?? 5000 // default 5 seconds

      this.notifications.push({
        ...notification,
        id,
        duration
      })

      if (duration > 0) {
        setTimeout(() => {
          this.remove(id)
        }, duration)
      }
    },

    remove(id: string) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    // Convenience methods
    success(message: string, title = 'Success') {
      this.add({ type: 'success', message, title })
    },

    error(message: string, title = 'Error') {
      this.add({ type: 'error', message, title })
    },

    warning(message: string, title = 'Warning') {
      this.add({ type: 'warning', message, title })
    },

    info(message: string, title = 'Info') {
      this.add({ type: 'info', message, title })
    }
  }
})