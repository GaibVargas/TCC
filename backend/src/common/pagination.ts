import { z } from 'zod'

export const pagination_query_schema = z.object({
  page: z.number().int().default(1),
  page_size: z.number().int().default(10),
})
export type PaginationQuery = z.infer<typeof pagination_query_schema>

export type PrismaPaginationQuery = {
  skip: number,
  take: number
}
export function getPrismaPagination(query: PaginationQuery): PrismaPaginationQuery {
  const skip = (query.page - 1) * query.page_size
  const take = query.page_size
  return {
    skip,
    take,
  }
}

export type Paginated<T> = {
  items: T,
  count: number
}