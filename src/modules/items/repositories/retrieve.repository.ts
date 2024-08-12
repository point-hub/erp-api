import type { IDatabase, IPipeline, IRetrieveOutput, IRetrieveRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveItemOutput extends IRetrieveOutput {
  chart_of_account?: {
    code?: string
    name?: string
  }
  category?: {
    code?: string
    name?: string
  }
  code?: string
  name?: string
  unit?: string
  have_production_number?: string
  have_an_expiry_date?: string
  created_date?: Date
  updated_date?: Date
}
export interface IRetrieveItemRepository extends IRetrieveRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveItemOutput>
}

export class RetrieveItemRepository implements IRetrieveItemRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveItemOutput> {
    const pipeline: IPipeline[] = []

    const filters = [] // filter keys using "and" logic

    filters.push({ _id: _id })

    pipeline.push(...this.aggregateJoinCategory())
    pipeline.push(...this.aggregateJoinChartOfAccount())

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, options)

    return {
      _id: response.data[0]._id as string,
      ...response.data[0],
    }
  }

  private aggregateJoinCategory() {
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
      { $unwind: '$category' },
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
      { $unwind: '$chart_of_account' },
      { $unset: ['chart_of_account_id'] },
    ]
  }
}
