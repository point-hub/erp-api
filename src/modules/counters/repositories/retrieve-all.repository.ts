import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveCounterOutput } from './retrieve.repository'

export interface IRetrieveAllCounterOutput {
  data: IRetrieveCounterOutput[]
  pagination: IPagination
}

export interface IRetrieveAllCounterRepository {
  handle(query: IQuery): Promise<IRetrieveAllCounterOutput>
}

export class RetrieveAllCounterRepository implements IRetrieveAllCounterRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllCounterOutput> {
    const pipeline: IPipeline[] = []

    const filters = []

    if (query.filter?.code) filters.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filters.push({ name: { $regex: query.filter?.name, $options: 'i' } })

    if (filters.length) {
      pipeline.push({ $match: { $and: filters } })
    }

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, this.options)

    return {
      data: response.data as unknown as IRetrieveCounterOutput[],
      pagination: response.pagination,
    }
  }
}
