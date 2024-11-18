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

    pipeline.push(...this.aggregateJoinItemCategory())
    pipeline.push(...this.aggregateJoinChartOfAccount())
    pipeline.push(...this.aggregateFilters(query))
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())
    pipeline.push(...this.aggregateAddFields())

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, this.options)

    return {
      data: response.data as unknown as IRetrieveItemOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateJoinCreatedBy() {
    return [
      {
        $lookup: {
          from: 'users',
          localField: 'created_by',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, username: 1, name: 1, email: 1 } }],
          as: 'created_by',
        },
      },
      {
        $unwind: {
          path: '$created_by',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]
  }

  private aggregateJoinUpdatedBy() {
    return [
      {
        $lookup: {
          from: 'users',
          localField: 'updated_by',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, username: 1, name: 1, email: 1 } }],
          as: 'updated_by',
        },
      },
      {
        $unwind: {
          path: '$updated_by',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]
  }

  private aggregateJoinItemCategory() {
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
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },
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
      {
        $unwind: {
          path: '$chart_of_account',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unset: ['chart_of_account_id'] },
    ]
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
