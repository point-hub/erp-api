import type { IDatabase, IPipeline, IRetrieveOutput, IRetrieveRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveAllocationOutput extends IRetrieveOutput {
  code?: string
  name?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allocation_group?: any
  created_date?: Date
  updated_date?: Date
}
export interface IRetrieveAllocationRepository extends IRetrieveRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveAllocationOutput>
}

export class RetrieveAllocationRepository implements IRetrieveAllocationRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveAllocationOutput> {
    const pipeline: IPipeline[] = []

    const filters = [] // filter keys using "and" logic

    filters.push({ _id: _id })

    if (filters.length) {
      pipeline.push({ $match: { $and: filters } })
    }

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

    const response = await this.database.collection(this.collection).aggregate(pipeline, {}, options)

    return {
      _id: response.data[0]._id as string,
      ...response.data[0],
    }
  }
}
