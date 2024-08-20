import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveAllocationOutput } from './retrieve.repository'

export interface IRetrieveAllAllocationOutput {
  data: IRetrieveAllocationOutput[]
  pagination: IPagination
}
export interface IRetrieveAllAllocationRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllAllocationOutput>
}

export class RetrieveAllAllocationRepository implements IRetrieveAllAllocationRepository {
  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllAllocationOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateJoinAllocationGroup())
    pipeline.push(...this.aggregateFilters(query))
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, options)

    return {
      data: response.data as unknown as IRetrieveAllocationOutput[],
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

  private aggregateJoinAllocationGroup() {
    return [
      {
        $lookup: {
          from: 'allocation_groups',
          localField: 'allocation_group_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, code: 1, name: 1 } }],
          as: 'allocation_group',
        },
      },
      {
        $unwind: {
          path: '$allocation_group',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unset: ['allocation_group_id'] },
    ]
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = []

    if (query.filter?.search) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'allocation_group.code': { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'allocation_group.name': { $regex: query.filter?.search, $options: 'i' } })
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
    if (query.filter?.allocation_group_id)
      filtersAnd.push({ 'allocation_group._id': { $eq: query.filter?.allocation_group_id } })
    if (query.filter?.allocation_group)
      filtersAnd.push({
        $or: [
          { 'allocation_group.code': { $regex: query.filter?.allocation_group, $options: 'i' } },
          { 'allocation_group.name': { $regex: query.filter?.allocation_group, $options: 'i' } },
        ],
      })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
