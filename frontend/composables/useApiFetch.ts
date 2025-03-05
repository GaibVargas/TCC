import type { FetchOptions } from "ofetch"

let refreshPromise: (() => Promise<boolean>) | null = null

const validMethods = [
  "GET",
  "HEAD",
  "PATCH",
  "POST",
  "PUT",
  "DELETE",
  "CONNECT",
  "OPTIONS",
  "TRACE",
  "get",
  "head",
  "patch",
  "post",
  "put",
  "delete",
  "connect",
  "options",
  "trace",
] as const
type ValidMethod = (typeof validMethods)[number]

export const useApiFetch = async <T>(
  path: string,
  options?: FetchOptions & { method?: ValidMethod }
) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl
  const headers = useApiRequestHeaders()
  const authStore = useAuthStore()
  try {
    const result = await $fetch<T>(path, {
      baseURL,
      ...options,
      method: options?.method ?? "GET",
      headers: {
        ...options?.headers,
        ...headers,
      },
    })
    return result
  } catch (error: any) {
    if (
      error.response?.status === 401 &&
      error.response?._data?.message === "Token has expired"
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
        method: options?.method ?? "GET",
        headers: {
          ...options?.headers,
          ...newHeaders,
        },
      })
    }

    throw error
  }
}
