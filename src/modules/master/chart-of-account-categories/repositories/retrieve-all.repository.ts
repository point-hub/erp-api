import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveChartOfAccountCategoryOutput } from './retrieve.repository'

export interface IRetrieveAllChartOfAccountCategoryOutput {
  data: IRetrieveChartOfAccountCategoryOutput[]
  pagination: IPagination
}
export interface IRetrieveAllChartOfAccountCategoryRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllChartOfAccountCategoryOutput>
}

export class RetrieveAllChartOfAccountCategoryRepository implements IRetrieveAllChartOfAccountCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllChartOfAccountCategoryOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateJoinTypes())
    pipeline.push(...this.aggregateFilters(query))

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, options)

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
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ address: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ phone: { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.code) filtersAnd.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.address) filtersAnd.push({ address: { $regex: query.filter?.address, $options: 'i' } })
    if (query.filter?.phone) filtersAnd.push({ phone: { $regex: query.filter?.phone, $options: 'i' } })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }

  join(pipeline: IPipeline[]) {
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
  }
}
