import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthReference } from '../../users/interface'
import { collectionName } from '../entity'
import { IChartOfAccountCategory, IChartOfAccountType } from '../interface'

export interface IRetrieveChartOfAccountOutput {
  _id: string
  label: string
  number: string
  name: string
  subledger: string
  category: IChartOfAccountCategory
  type: IChartOfAccountType
  notes: string
  created_by: IAuthReference
  updated_by: IAuthReference
  created_date: Date
  updated_date: Date
}
export interface IRetrieveChartOfAccountRepository {
  handle(_id: string): Promise<IRetrieveChartOfAccountOutput>
}

export class RetrieveChartOfAccountRepository implements IRetrieveChartOfAccountRepository {
  public collection = collectionName

  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IRetrieveChartOfAccountOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilter(_id))
    pipeline.push(...this.aggregateJoinCategories())
    pipeline.push(...this.aggregateJoinTypes())

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, this.options)

    return {
      _id: `${response.data[0]._id}`,
      label: `${response.data[0].name}`,
      number: `${response.data[0].number}`,
      name: `${response.data[0].name}`,
      subledger: `${response.data[0].subledger ?? ''}`,
      category: response.data[0].category as IChartOfAccountCategory,
      type: response.data[0].type as IChartOfAccountType,
      notes: `${response.data[0].notes ?? ''}`,
      created_by: response.data[0].created_by as IAuthReference,
      updated_by: response.data[0].updated_by as IAuthReference,
      created_date: response.data[0].created_date as Date,
      updated_date: response.data[0].updated_date as Date,
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
