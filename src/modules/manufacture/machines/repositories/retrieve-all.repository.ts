import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveMachineOutput } from './retrieve.repository'

export interface IRetrieveAllMachineOutput {
  data: IRetrieveMachineOutput[]
  pagination: IPagination
}
export interface IRetrieveAllMachineRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllMachineOutput>
}

export class RetrieveAllMachineRepository implements IRetrieveAllMachineRepository {
  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllMachineOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(query))

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, options)

    return {
      data: response.data as unknown as IRetrieveMachineOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = [] // filter keys using "and" logic
    const filtersOr = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.code) filtersAnd.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
