import { ref, onMounted, onUnmounted } from 'vue'

// timestamp em ms, limit em segundos
export function useCountdownTimer(timestamp: number, limit: number | null) {
  const remaining_time = ref<number>(0)
  if (!limit) return { remaining_time }

  const limit_timestamp = timestamp + limit * 1000
  let timer_interval: NodeJS.Timeout | null = null

  const updateRemainingTime = () => {
    const currentTime = new Date().getTime()
    const timeDifference = limit_timestamp - currentTime

    if (timeDifference <= 0) {
      remaining_time.value = 0
      if (timer_interval) clearInterval(timer_interval)
    } else {
      remaining_time.value = Math.max(0, Math.floor(timeDifference / 1000))
    }
  }

  onMounted(() => {
    console.log('montado timer')
    timer_interval = setInterval(updateRemainingTime, 1000)
    updateRemainingTime()
  })

  onUnmounted(() => {
    if (timer_interval) clearInterval(timer_interval)
  })

  return { remaining_time }
}
