import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveWarehouseOutput } from './retrieve.repository'

export interface IRetrieveAllWarehouseOutput {
  data: IRetrieveWarehouseOutput[]
  pagination: IPagination
}
export interface IRetrieveAllWarehouseRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllWarehouseOutput>
}

export class RetrieveAllWarehouseRepository implements IRetrieveAllWarehouseRepository {
  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllWarehouseOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateJoinBranch())
    pipeline.push(...this.aggregateFilters(query))
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, options)

    return {
      data: response.data as unknown as IRetrieveWarehouseOutput[],
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

  private aggregateJoinBranch() {
    return [
      {
        $lookup: {
          from: 'branches',
          localField: 'branch_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, code: 1, name: 1 } }],
          as: 'branch',
        },
      },
      {
        $unwind: {
          path: '$branch',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unset: ['branch_id'] },
    ]
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = []

    if (query.filter?.search) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ address: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ phone: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'branch.code': { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'branch.name': { $regex: query.filter?.search, $options: 'i' } })
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
    if (query.filter?.address) filtersAnd.push({ address: { $regex: query.filter?.address, $options: 'i' } })
    if (query.filter?.phone) filtersAnd.push({ phone: { $regex: query.filter?.phone, $options: 'i' } })
    if (query.filter?.branch)
      filtersAnd.push({
        $or: [
          { 'branch.code': { $regex: query.filter?.branch, $options: 'i' } },
          { 'branch.name': { $regex: query.filter?.branch, $options: 'i' } },
        ],
      })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
