import { useApiRequestHeaders } from "./useApiRequestHeaders"

export const useApiUseFetch = async <T>(path: string, options?: any) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl

  const authStore = useAuthStore()

  const fetchResult = useFetch<T>(path, {
    baseURL,
    ...options,
    async onRequest({ options, request }) {
      const headers = useApiRequestHeaders()
      options.headers = {
        ...options.headers,
        ...headers,
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401 && response._data.message === 'Token has expired' && !authStore.is_refreshing) {
        try {
          authStore.setIsRefreshing(true)
          await authStore.refreshToken()
          await fetchResult.refresh()
        } catch (refreshError) {
          authStore.logout()
          navigateTo("/")
        } finally {
          authStore.setIsRefreshing(false)
        }
      }
    },
  })

  return fetchResult
}
