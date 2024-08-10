import type { IAggregateOutput, IAggregateRepository, IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveChartOfAccountCategoryOutput } from './retrieve.repository'

export interface IRetrieveAllChartOfAccountCategoryOutput extends IAggregateOutput {
  data: IRetrieveChartOfAccountCategoryOutput[]
  pagination: IPagination
}
export interface IRetrieveAllChartOfAccountCategoryRepository extends IAggregateRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllChartOfAccountCategoryOutput>
}

export class RetrieveAllChartOfAccountCategoryRepository implements IRetrieveAllChartOfAccountCategoryRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllChartOfAccountCategoryOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push({
      $lookup: {
        from: 'chart_of_account_types',
        localField: 'type_id',
        foreignField: '_id',
        pipeline: [{ $project: { name: 1 } }],
        as: 'type',
      },
    })

    pipeline.push({ $unwind: '$type' })
    pipeline.push({ $unset: ['type_id'] })

    const filtersAnd = [] // filter keys using "and" logic
    const filtersOr = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'type.name': { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }
    if (query.filter?.type_id) filtersAnd.push({ 'type._id': { $eq: query.filter?.type_id } })
    if (query.filter?.type) filtersAnd.push({ 'type.name': { $regex: query.filter?.type, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })

    if (filtersAnd.length) {
      pipeline.push({ $match: { $and: filtersAnd } })
    }

    const response = await this.database.collection(this.collection).aggregate(pipeline, query, options)

    return {
      data: response.data as IRetrieveChartOfAccountCategoryOutput[],
      pagination: response.pagination,
    }
  }
}
