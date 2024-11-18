import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveChartOfAccountCategoryOutput } from './retrieve.repository'

export interface IRetrieveAllChartOfAccountCategoryOutput {
  data: IRetrieveChartOfAccountCategoryOutput[]
  pagination: IPagination
}
export interface IRetrieveAllChartOfAccountCategoryRepository {
  handle(query: IQuery): Promise<IRetrieveAllChartOfAccountCategoryOutput>
}

export class RetrieveAllChartOfAccountCategoryRepository implements IRetrieveAllChartOfAccountCategoryRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllChartOfAccountCategoryOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateJoinTypes())
    pipeline.push(...this.aggregateFilters(query))

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, this.options)

    return {
      data: response.data as unknown as IRetrieveChartOfAccountCategoryOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateJoinTypes() {
    return [
      {
        $lookup: {
          from: 'chart_of_account_types',
          localField: 'type_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, name: 1 } }],
          as: 'type',
        },
      },
      { $unwind: '$type' },
      { $unset: ['type_id'] },
    ]
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = [] // filter keys using "and" logic
    const filtersOr = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'type.name': { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.type_id) filtersAnd.push({ 'type._id': { $eq: query.filter?.type_id } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.type) filtersAnd.push({ 'type.name': { $regex: query.filter?.type, $options: 'i' } })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
