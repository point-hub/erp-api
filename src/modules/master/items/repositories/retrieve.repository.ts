import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthBy } from '@/modules/master/users/interface'

import { collectionName } from '../entity'

interface IItemCategory {
  _id: string
  code: string
  name: string
}

export interface IRetrieveItemOutput {
  _id: string
  code: string
  name: string
  address: string
  phone: string
  email: string
  bank_name: string
  bank_branch: string
  bank_account_name: string
  bank_account_number: string
  notes: string
  category: IItemCategory
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
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, options)

    const created_by = response.data[0].created_by as IAuthBy
    const updated_by = response.data[0].updated_by as IAuthBy

    return {
      _id: response.data[0]._id as string,
      code: response.data[0].code as string,
      name: response.data[0].name as string,
      address: response.data[0].address as string,
      phone: response.data[0].phone as string,
      email: response.data[0].email as string,
      bank_name: response.data[0].bank_name as string,
      bank_branch: response.data[0].bank_branch as string,
      bank_account_name: response.data[0].bank_account_number as string,
      bank_account_number: response.data[0].bank_account_name as string,
      notes: response.data[0].notes as string,
      category: {
        _id: (response.data[0].category as IItemCategory)._id as string,
        code: (response.data[0].category as IItemCategory).code as string,
        name: (response.data[0].category as IItemCategory).name as string,
      },
      created_by: {
        _id: created_by?._id as string,
        name: created_by?.name as string,
        username: created_by?.username as string,
        email: created_by?.email as string,
      },
      updated_by: {
        _id: updated_by?._id as string,
        name: updated_by?.name as string,
        username: updated_by?.username as string,
        email: updated_by?.email as string,
      },
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
      { $unset: ['category_id'] },
    ]
  }

  private aggregateFilters(_id: string) {
    return [{ $match: { _id: _id } }]
  }
}
