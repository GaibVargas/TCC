import { useApiRequestHeaders } from "./useApiRequestHeaders"

let refreshPromise: (() => Promise<boolean>) | null = null

export const useApiUseFetch = async <T>(path: string, options?: any) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl

  const authStore = useAuthStore()

  const fetchResult = useFetch<T>(path, {
    baseURL,
    ...options,
    async onRequest({ options }) {
      const headers = useApiRequestHeaders()
      options.headers = {
        ...options.headers,
        ...headers,
      }
    },
    async onResponseError({ response }) {
      if (
        response.status === 401 &&
        response._data.message === "Token has expired" &&
        !refreshPromise
      ) {
        refreshPromise = authStore.refreshToken
      }
      if (refreshPromise) {
        const is_successful = await refreshPromise()
        refreshPromise = null
        if (!is_successful) return
        await fetchResult.refresh()
      }
    },
  })

  return fetchResult
}
