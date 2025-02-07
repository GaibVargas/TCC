export const useApiRequest = async <T>(path: string, options?: any) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl

  const { access_token } = useAuthStore()

  return await useFetch<T>(path, {
    baseURL,
    ...options,
    headers: {
      authorization: access_token ? `${access_token}` : "",
      ...options?.headers,
    },
  })
}
