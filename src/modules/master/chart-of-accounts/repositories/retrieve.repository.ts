import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthBy } from '../../users/interface'
import { collectionName } from '../entity'

export interface IRetrieveChartOfAccountOutput {
  _id?: string
  number?: string
  name?: string
  subledger?: string
  category?: {
    _id: string
    code: string
    name: string
  }
  type?: {
    _id: string
    code: string
    name: string
  }
  notes?: string
  created_by?: IAuthBy
  updated_by?: IAuthBy
  created_date?: Date
  updated_date?: Date
}
export interface IRetrieveChartOfAccountRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveChartOfAccountOutput>
}

export class RetrieveChartOfAccountRepository implements IRetrieveChartOfAccountRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveChartOfAccountOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilter(_id))
    pipeline.push(...this.aggregateJoinCategories())
    pipeline.push(...this.aggregateJoinTypes())

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, options)

    return {
      _id: response.data[0]._id as string,
      ...response.data[0],
    }
  }

  private aggregateJoinCategories() {
    return [
      {
        $lookup: {
          from: 'chart_of_account_categories',
          localField: 'category_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, type_id: 1, name: 1 } }],
          as: 'category',
        },
      },
      { $unwind: '$category' },
      { $unset: ['category_id'] },
    ]
  }

  private aggregateJoinTypes() {
    return [
      {
        $lookup: {
          from: 'chart_of_account_types',
          localField: 'category.type_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, name: 1 } }],
          as: 'type',
        },
      },
      { $unwind: '$type' },
      { $unset: ['category.type_id'] },
    ]
  }

  private aggregateFilter(_id: string) {
    return [
      {
        $match: { _id: { $eq: _id } },
      },
    ]
  }
}
