import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveItemOutput } from './retrieve.repository'

export interface IRetrieveAllItemOutput {
  data: IRetrieveItemOutput[]
  pagination: IPagination
}
export interface IRetrieveAllItemRepository {
  handle(query: IQuery): Promise<IRetrieveAllItemOutput>
}

export class RetrieveAllItemRepository implements IRetrieveAllItemRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllItemOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(query))

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, this.options)

    return {
      data: response.data as unknown as IRetrieveItemOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = []

    if (query.filter?.search) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ unit: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ phone: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'category.code': { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'category.name': { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'chart_of_account.number': { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'chart_of_account.name': { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.label) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.label, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.label, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.code) filtersAnd.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.unit) filtersAnd.push({ unit: { $regex: query.filter?.unit, $options: 'i' } })
    if (query.filter?.phone) filtersAnd.push({ phone: { $regex: query.filter?.phone, $options: 'i' } })
    if (query.filter?.category_id) filtersAnd.push({ 'category._id': { $eq: query.filter?.category_id } })
    if (query.filter?.category)
      filtersAnd.push({
        $or: [
          { 'category.code': { $regex: query.filter?.category, $options: 'i' } },
          { 'category.name': { $regex: query.filter?.category, $options: 'i' } },
        ],
      })
    if (query.filter?.chart_of_account)
      filtersAnd.push({
        $or: [
          { 'chart_of_account.number': { $regex: query.filter?.chart_of_account, $options: 'i' } },
          { 'chart_of_account.name': { $regex: query.filter?.chart_of_account, $options: 'i' } },
        ],
      })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
