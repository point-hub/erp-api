import type { IAggregateOutput, IAggregateRepository, IDatabase, IPipeline, IQuery } from '@point-hub/papi'
import { addDays } from 'date-fns'

import { collectionName } from '../entity'

export class RetrieveAllRepository implements IAggregateRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IAggregateOutput> {
    const pipeline: IPipeline[] = []

    const filters = [] // filter keys using "and" logic
    console.log(query)

    if (query.filter?.name) {
      filters.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    }

    if (filters.length) {
      pipeline.push({ $match: { $and: filters } })
    }
    console.log(pipeline)
    const response = await this.database.collection(this.collection).aggregate(pipeline, query, options)

    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
