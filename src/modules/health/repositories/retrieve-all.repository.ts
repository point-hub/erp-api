import type { IAggregateOutput, IAggregateRepository, IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveHealthOutput } from './retrieve.repository'

export interface IRetrieveAllHealthOutput extends IAggregateOutput {
  data: IRetrieveHealthOutput[]
  pagination: IPagination
}
export interface IRetrieveAllHealthRepository extends IAggregateRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllHealthOutput>
}

export class RetrieveAllHealthRepository implements IRetrieveAllHealthRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllHealthOutput> {
    const pipeline: IPipeline[] = []

    const filters = []

    if (query.filter?.name) filters.push({ name: { $regex: query.filter?.name, $options: 'i' } })

    if (filters.length) {
      pipeline.push({ $match: { $and: filters } })
    }

    const response = await this.database.collection(this.collection).aggregate(pipeline, query, options)

    return {
      data: response.data as IRetrieveHealthOutput[],
      pagination: response.pagination,
    }
  }
}
