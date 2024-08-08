import type { IAggregateOutput, IAggregateRepository, IDatabase, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrievePermissionOutput } from './retrieve.repository'

export interface IRetrieveAllPermissionOutput extends IAggregateOutput {
  data: IRetrievePermissionOutput[]
}
export interface IRetrieveAllPermissionRepository extends IAggregateRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllPermissionOutput>
}

export class RetrieveAllPermissionRepository implements IRetrieveAllPermissionRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllPermissionOutput> {
    const pipeline: IPipeline[] = []

    const filters = [] // filter keys using "and" logic
    const filterAll = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filterAll.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filterAll.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filterAll.push({ address: { $regex: query.filter?.search, $options: 'i' } })
      filterAll.push({ phone: { $regex: query.filter?.search, $options: 'i' } })
      filters.push({ $or: filterAll })
    }

    if (query.filter?.code) filters.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filters.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.address) filters.push({ address: { $regex: query.filter?.address, $options: 'i' } })
    if (query.filter?.phone) filters.push({ phone: { $regex: query.filter?.phone, $options: 'i' } })

    if (filters.length) {
      pipeline.push({ $match: { $and: filters } })
    }

    const response = await this.database.collection(this.collection).aggregate(pipeline, query, options)

    return {
      data: response.data as IRetrievePermissionOutput[],
      pagination: response.pagination,
    }
  }
}
