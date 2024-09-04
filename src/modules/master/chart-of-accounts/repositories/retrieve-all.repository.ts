import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveChartOfAccountOutput } from './retrieve.repository'

export interface IRetrieveAllChartOfAccountOutput {
  data: IRetrieveChartOfAccountOutput[]
  pagination: IPagination
}
export interface IRetrieveAllChartOfAccountRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllChartOfAccountOutput>
}

export class RetrieveAllChartOfAccountRepository implements IRetrieveAllChartOfAccountRepository {
  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllChartOfAccountOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateJoinCategories())
    pipeline.push(...this.aggregateJoinTypes())
    pipeline.push(...this.aggregateFilters(query))
    pipeline.push(...this.aggregateAddFields())

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, options)

    return {
      data: response.data as unknown as IRetrieveChartOfAccountOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateJoinCategories() {
    return [
      {
        $lookup: {
          from: 'chart_of_account_categories',
          localField: 'category_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, type_id: 1, code: 1, name: 1 } }],
          as: 'category',
        },
      },
      { $unwind: '$category' },
      { $unset: ['category_id'] },
    ]
  }

  private aggregateJoinTypes() {
    return [
      {
        $lookup: {
          from: 'chart_of_account_types',
          localField: 'category.type_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, code: 1, name: 1 } }],
          as: 'type',
        },
      },
      { $unwind: '$type' },
      { $unset: ['category.type_id'] },
    ]
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = [] // filter keys using "and" logic
    const filtersOr = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filtersOr.push({ number: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ subledger: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'type.name': { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'category.name': { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.number) filtersAnd.push({ number: { $regex: query.filter?.number, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.subledger) filtersAnd.push({ subledger: { $regex: query.filter?.subledger, $options: 'i' } })
    if (query.filter?.type) filtersAnd.push({ 'type.name': { $regex: query.filter?.type, $options: 'i' } })
    if (query.filter?.category) filtersAnd.push({ 'category.name': { $regex: query.filter?.category, $options: 'i' } })

    if (query.filter?.type_code) filtersAnd.push({ 'type.code': { $eq: query.filter?.type_code } })
    if (query.filter?.category_code) filtersAnd.push({ 'category.code': { $eq: query.filter?.category_code } })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }

  private aggregateAddFields() {
    return [
      {
        $addFields: {
          label: {
            $concat: ['[', '$code', '] ', '$name'],
          },
        },
      },
    ]
  }
}
