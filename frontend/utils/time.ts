export function getSecondsHumanized(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  let response = ''
  if (minutes) response += `${minutes}m`
  if (seconds) response += `${seconds}s`
  return response
}