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

    const filters = [] // filter keys using "and" logic
    const filterAll = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filterAll.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filterAll.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filterAll.push({ notes: { $regex: query.filter?.search, $options: 'i' } })
      filters.push({ $or: filterAll })
    }

    if (query.filter?.code) filters.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filters.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.notes) filters.push({ notes: { $regex: query.filter?.notes, $options: 'i' } })

    if (filters.length) {
      pipeline.push({ $match: { $and: filters } })
    }

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, options)

    return {
      data: response.data as unknown as IRetrieveMachineOutput[],
      pagination: response.pagination,
    }
  }
}
