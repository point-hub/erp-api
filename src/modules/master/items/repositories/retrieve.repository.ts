import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthBy } from '@/modules/master/users/interface'

import { collectionName } from '../entity'

interface IItemCategory {
  _id: string
  label: string
  code: string
  name: string
}

interface IChartOfAccount {
  _id: string
  label: string
  number: string
  name: string
}

export interface IRetrieveItemOutput {
  _id: string
  chart_of_account: IChartOfAccount
  category: IItemCategory
  label: string
  code: string
  name: string
  unit: string
  have_production_number: boolean
  have_an_expiry_date: boolean
  notes: string
  created_by: IAuthBy
  updated_by: IAuthBy
  created_date: Date
  updated_date: Date
}
export interface IRetrieveItemRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveItemOutput>
}

export class RetrieveItemRepository implements IRetrieveItemRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveItemOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(_id))
    pipeline.push(...this.aggregateJoinItemCategory())
    pipeline.push(...this.aggregateJoinChartOfAccount())
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, options)

    return {
      _id: `${response.data[0]._id}`,
      label: `[${response.data[0].code}] ${response.data[0].name}`,
      code: `${response.data[0].code}`,
      name: `${response.data[0].name}`,
      unit: `${response.data[0].unit}`,
      have_production_number: response.data[0].have_production_number as boolean,
      have_an_expiry_date: response.data[0].have_an_expiry_date as boolean,
      notes: `${response.data[0].notes ?? ''}`,
      category: response.data[0].category as IItemCategory,
      chart_of_account: response.data[0].chart_of_account as IChartOfAccount,
      created_by: response.data[0].created_by as IAuthBy,
      updated_by: response.data[0].updated_by as IAuthBy,
      created_date: response.data[0].created_date as Date,
      updated_date: response.data[0].updated_date as Date,
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

  private aggregateJoinItemCategory() {
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
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          'category.label': {
            $concat: ['[', '$category.code', '] ', '$category.name'],
          },
        },
      },
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
      {
        $unwind: {
          path: '$chart_of_account',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          'chart_of_account.label': {
            $concat: ['[', '$chart_of_account.number', '] ', '$chart_of_account.name'],
          },
        },
      },
      { $unset: ['chart_of_account_id'] },
    ]
  }

  private aggregateFilters(_id: string) {
    return [{ $match: { _id: _id } }]
  }
}
