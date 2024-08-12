import type { IAggregateOutput, IAggregateRepository, IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'
import { filter } from 'compression'

import { collectionName } from '../entity'
import { IRetrieveItemOutput } from './retrieve.repository'

export interface IRetrieveAllItemOutput extends IAggregateOutput {
  data: IRetrieveItemOutput[]
  pagination: IPagination
}
export interface IRetrieveAllItemRepository extends IAggregateRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllItemOutput>
}

export class RetrieveAllItemRepository implements IRetrieveAllItemRepository {
  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllItemOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateJoinCategory())
    pipeline.push(...this.aggregateJoinChartOfAccount())
    pipeline.push(...this.aggregateFilters(query))

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, options)

    return {
      data: response.data as IRetrieveAllItemOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateJoinCategory() {
    return [
      {
        $lookup: {
          from: 'item_categories',
          localField: 'category_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, code: 1, name: 1 } }],
          as: 'category',
        },
      },
      { $unwind: '$category' },
      { $unset: ['category_id'] },
    ]
  }

  private aggregateJoinChartOfAccount() {
    return [
      {
        $lookup: {
          from: 'chart_of_accounts',
          localField: 'chart_of_account_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, number: 1, name: 1 } }],
          as: 'chart_of_account',
        },
      },
      { $unwind: '$chart_of_account' },
      { $unset: ['chart_of_account_id'] },
    ]
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = [] // filter keys using "and" logic
    const filtersOr = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ unit: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'chart_of_account.name': { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'category.name': { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.code) filtersAnd.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.unit) filtersAnd.push({ unit: { $regex: query.filter?.unit, $options: 'i' } })
    if (query.filter?.chart_of_account)
      filtersAnd.push({ 'chart_of_account.name': { $regex: query.filter?.chart_of_account, $options: 'i' } })
    if (query.filter?.category) filtersAnd.push({ 'category.name': { $regex: query.filter?.category, $options: 'i' } })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
