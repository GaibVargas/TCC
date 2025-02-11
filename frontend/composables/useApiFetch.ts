let refreshPromise: (() => Promise<boolean>) | null = null

export const useApiFetch = async <T>(path: string, options?: any) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl
  const headers = useApiRequestHeaders()
  const authStore = useAuthStore()
  try {
    return await $fetch<T>(path, {
      baseURL,
      ...options,
      headers: {
        ...options?.headers,
        ...headers,
      },
    })
  } catch (error: any) {
    if (
      error.response?.status === 401 &&
      error.response?._data?.message === 'Token has expired'
    ) {
      if (!refreshPromise) {
        refreshPromise = authStore.refreshToken
      }
      const is_successful = await refreshPromise()
      refreshPromise = null
      if (!is_successful) return
      const newHeaders = useApiRequestHeaders()
      return await $fetch<T>(path, {
        baseURL,
        ...options,
        headers: {
          ...options?.headers,
          ...newHeaders,
        },
      })
    }

    throw error
  }
}