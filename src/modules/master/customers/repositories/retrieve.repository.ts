import type { IDatabase, IPipeline, IRetrieveOutput, IRetrieveRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveCustomerOutput extends IRetrieveOutput {
  code?: string
  name?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customer_group?: any
  created_date?: Date
  updated_date?: Date
}
export interface IRetrieveCustomerRepository extends IRetrieveRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveCustomerOutput>
}

export class RetrieveCustomerRepository implements IRetrieveCustomerRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveCustomerOutput> {
    const pipeline: IPipeline[] = []

    const filters = [] // filter keys using "and" logic

    filters.push({ _id: _id })

    if (filters.length) {
      pipeline.push({ $match: { $and: filters } })
    }

    pipeline.push({
      $lookup: {
        from: 'customer_groups',
        localField: 'customer_group_id',
        foreignField: '_id',
        pipeline: [{ $project: { code: 1, name: 1 } }],
        as: 'customer_group',
      },
    })
    pipeline.push({
      $set: {
        customer_group: {
          $arrayElemAt: ['$customer_group', 0],
        },
      },
    })
    pipeline.push({ $unset: ['customer_group_id'] })

    const response = await this.database.collection(this.collection).aggregate(pipeline, {}, options)

    return {
      _id: response.data[0]._id as string,
      ...response.data[0],
    }
  }
}
