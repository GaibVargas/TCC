export const useApiRequestHeaders = () => {
  const authStore = useAuthStore()
  return {
    Authorization: authStore.access_token ? authStore.access_token : "",
    "www-authenticate": authStore.refresh_token ? authStore.refresh_token : "",
  }
}