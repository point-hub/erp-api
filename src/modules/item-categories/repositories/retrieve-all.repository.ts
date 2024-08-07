import type { IAggregateOutput, IAggregateRepository, IDatabase, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveItemCategoryOutput } from './retrieve.repository'

export interface IRetrieveAllItemCategoryOutput extends IAggregateOutput {
  data: IRetrieveItemCategoryOutput[]
}
export interface IRetrieveAllItemCategoryRepository extends IAggregateRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllItemCategoryOutput>
}

export class RetrieveAllItemCategoryRepository implements IRetrieveAllItemCategoryRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllItemCategoryOutput> {
    const pipeline: IPipeline[] = []

    const filtersAnd = [] // filter keys using "and" logic
    const filtersOr = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.code) filtersAnd.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })

    if (filtersAnd.length) {
      pipeline.push({ $match: { $and: filtersAnd } })
    }

    const response = await this.database.collection(this.collection).aggregate(pipeline, query, options)

    return {
      data: response.data as IRetrieveItemCategoryOutput[],
      pagination: response.pagination,
    }
  }
}
