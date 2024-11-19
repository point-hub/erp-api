import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveAllocationOutput } from './retrieve.repository'

export interface IRetrieveAllAllocationOutput {
  data: IRetrieveAllocationOutput[]
  pagination: IPagination
}
export interface IRetrieveAllAllocationRepository {
  handle(query: IQuery): Promise<IRetrieveAllAllocationOutput>
}

export class RetrieveAllAllocationRepository implements IRetrieveAllAllocationRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllAllocationOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(query))
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, this.options)

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

  private aggregateFilters(query: IQuery) {
    const filtersAnd = []

    if (query.filter?.search) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ label: { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.code) {
      filtersAnd.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    }
    if (query.filter?.name) {
      filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    }
    if (query.filter?.label) {
      filtersAnd.push({ label: { $regex: query.filter?.label, $options: 'i' } })
    }
    if (query.filter?.allocation_group) {
      filtersAnd.push({ 'allocation_group.label': { $regex: query.filter?.allocation_group, $options: 'i' } })
    }

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
