import type { IDatabase, IPipeline, IRetrieveOutput, IRetrieveRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveChartOfAccountTypeOutput extends IRetrieveOutput {
  name?: string
  created_date?: Date
  updated_date?: Date
}
export interface IRetrieveChartOfAccountTypeRepository extends IRetrieveRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveChartOfAccountTypeOutput>
}

export class RetrieveChartOfAccountTypeRepository implements IRetrieveChartOfAccountTypeRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveChartOfAccountTypeOutput> {
    const pipeline: IPipeline[] = []

    const filters = [] // filter keys using "and" logic

    filters.push({ _id: _id })

    if (filters.length) {
      pipeline.push({ $match: { $and: filters } })
    }

    pipeline.push({
      $lookup: {
        from: 'branches',
        localField: 'branch_id',
        foreignField: '_id',
        pipeline: [{ $project: { code: 1, name: 1 } }],
        as: 'branch',
      },
    })
    pipeline.push({
      $set: {
        branch: {
          $arrayElemAt: ['$branch', 0],
        },
      },
    })
    pipeline.push({ $unset: ['branch_id'] })

    const response = await this.database.collection(this.collection).aggregate(pipeline, {}, options)

    return {
      _id: response.data[0]._id as string,
      ...response.data[0],
    }
  }
}
