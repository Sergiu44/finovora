import type { QueryClient } from "@tanstack/react-query"

export type BaseHookProps<T> = T & {
  queryClient: QueryClient
}