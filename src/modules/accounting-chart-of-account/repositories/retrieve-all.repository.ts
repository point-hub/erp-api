import type { IDatabase, IQuery, IRetrieveAllOutput, IRetrieveAllRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

export class RetrieveAllRepository implements IRetrieveAllRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllOutput> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipeline: any[] = []
    if (query && query.filter) {
      pipeline.push({ $match: { ...query.filter } })
    }
    return await this.database.collection(this.collection).aggregate(pipeline, query, options)
  }
}
