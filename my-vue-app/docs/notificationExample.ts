import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()

// Examples
notificationStore.success('Your habit was marked as complete!')
notificationStore.warning('You missed your habit yesterday')
notificationStore.error('Failed to save changes')
notificationStore.info('New feature available!')

// With custom duration
notificationStore.add({
  type: 'success',
  title: 'Achievement Unlocked!',
  message: '7-day streak completed!',
  duration: 10000 // 10 seconds
})