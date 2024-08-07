import type { IAggregateOutput, IAggregateRepository, IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveAllocationOutput } from './retrieve.repository'

export interface IRetrieveAllAllocationOutput extends IAggregateOutput {
  data: IRetrieveAllocationOutput[]
  pagination: IPagination
}
export interface IRetrieveAllAllocationRepository extends IAggregateRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllAllocationOutput>
}

export class RetrieveAllAllocationRepository implements IRetrieveAllAllocationRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllAllocationOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push({
      $lookup: {
        from: 'allocation_groups',
        localField: 'allocation_group_id',
        foreignField: '_id',
        pipeline: [{ $project: { code: 1, name: 1 } }],
        as: 'allocation_group',
      },
    })

    pipeline.push({
      $set: {
        allocation_group: {
          $arrayElemAt: ['$allocation_group', 0],
        },
      },
    })
    pipeline.push({ $unset: ['allocation_group_id'] })

    const filtersAnd = [] // filter keys using "and" logic
    const filtersOr = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({
        $or: [
          { 'allocation_group.code': { $regex: query.filter?.search, $options: 'i' } },
          { 'allocation_group.name': { $regex: query.filter?.search, $options: 'i' } },
        ],
      })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.code) filtersAnd.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.allocation_group)
      filtersAnd.push({
        $or: [
          { 'allocation_group.code': { $regex: query.filter?.allocation_group, $options: 'i' } },
          { 'allocation_group.name': { $regex: query.filter?.allocation_group, $options: 'i' } },
        ],
      })

    if (filtersAnd.length) {
      pipeline.push({ $match: { $and: filtersAnd } })
    }

    const response = await this.database.collection(this.collection).aggregate(pipeline, query, options)

    return {
      data: response.data as IRetrieveAllocationOutput[],
      pagination: response.pagination,
    }
  }
}
