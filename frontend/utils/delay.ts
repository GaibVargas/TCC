export async function delay(time = 1000) {
  return await new Promise(resolve => setTimeout(resolve, 1000))
}