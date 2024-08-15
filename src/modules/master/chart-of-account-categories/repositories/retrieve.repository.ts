import type { IDatabase, IPipeline } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveChartOfAccountCategoryOutput {
  _id: string
  type: {
    _id: string
    name: string
  }
  name: string
  created_date: Date
  updated_date: Date
}
export interface IRetrieveChartOfAccountCategoryRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveChartOfAccountCategoryOutput>
}

export class RetrieveChartOfAccountCategoryRepository implements IRetrieveChartOfAccountCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveChartOfAccountCategoryOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilter(_id))
    pipeline.push(...this.aggregateJoinTypes())

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, options)

    return {
      _id: response.data[0]._id as string,
      type: response.data[0].type as { _id: string; name: string },
      name: response.data[0].name as string,
      created_date: response.data[0].created_date as Date,
      updated_date: response.data[0].updated_date as Date,
    }
  }

  private aggregateJoinTypes() {
    return [
      {
        $lookup: {
          from: 'chart_of_account_types',
          localField: 'type_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, name: 1 } }],
          as: 'type',
        },
      },
      { $unwind: '$type' },
      { $unset: ['type_id'] },
    ]
  }

  private aggregateFilter(_id: string) {
    return [{ $match: { _id: { $eq: _id } } }]
  }
}
