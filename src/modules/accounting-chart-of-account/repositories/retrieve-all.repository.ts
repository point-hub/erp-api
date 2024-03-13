import type { IDatabase, IQuery, IRetrieveAllOutput, IRetrieveAllRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

export class RetrieveAllRepository implements IRetrieveAllRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllOutput> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipeline: any[] = []
    const filters = []
    if (query?.filter?.name) {
      filters.push({ name: { $regex: query?.filter?.name, $options: 'i' } })
    }
    if (query?.filter?.number) {
      filters.push({ number: { $regex: query?.filter?.number, $options: 'i' } })
    }
    if (query?.filter?.type) {
      filters.push({ type: { $regex: query?.filter?.type, $options: 'i' } })
    }
    if (query?.filter?.subledger) {
      filters.push({ subledger: { $regex: query?.filter?.subledger, $options: 'i' } })
    }
    const filter = {
      $or: [...filters],
    }
    if (filters.length) {
      pipeline.push({ $match: { ...filter } })
    }
    console.log(pipeline[0])
    console.log(query)
    return await this.database.collection(this.collection).aggregate(pipeline, query, options)
  }
}
