import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveChartOfAccountTypeOutput } from './retrieve.repository'

export interface IRetrieveAllChartOfAccountTypeOutput {
  data: IRetrieveChartOfAccountTypeOutput[]
  pagination: IPagination
}
export interface IRetrieveAllChartOfAccountTypeRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllChartOfAccountTypeOutput>
}

export class RetrieveAllChartOfAccountTypeRepository implements IRetrieveAllChartOfAccountTypeRepository {
  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllChartOfAccountTypeOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(query))

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, options)

    return {
      data: response.data as unknown as IRetrieveChartOfAccountTypeOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = [] // filter keys using "and" logic
    const filtersOr = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
