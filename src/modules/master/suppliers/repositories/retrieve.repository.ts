import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthBy } from '@/modules/master/users/interface'

import { collectionName } from '../entity'

interface ISupplierGroup {
  _id: string
  label: string
  code: string
  name: string
}

export interface IRetrieveSupplierOutput {
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
  supplier_group: ISupplierGroup
  created_by: IAuthBy
  updated_by: IAuthBy
  created_date: Date
  updated_date: Date
}
export interface IRetrieveSupplierRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveSupplierOutput>
}

export class RetrieveSupplierRepository implements IRetrieveSupplierRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveSupplierOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(_id))
    pipeline.push(...this.aggregateJoinSupplierGroup())
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, options)
    console.log(response)
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
      supplier_group: {
        _id: (response.data[0].supplier_group as ISupplierGroup)._id,
        label: (response.data[0].supplier_group as ISupplierGroup).label,
        code: (response.data[0].supplier_group as ISupplierGroup).code,
        name: (response.data[0].supplier_group as ISupplierGroup).name,
      },
      created_by: {
        _id: created_by?._id,
        name: created_by?.name,
        username: created_by?.username,
        email: created_by?.email,
      },
      updated_by: {
        _id: updated_by?._id,
        name: updated_by?.name,
        username: updated_by?.username,
        email: updated_by?.email,
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

  private aggregateJoinSupplierGroup() {
    return [
      {
        $lookup: {
          from: 'supplier_groups',
          localField: 'supplier_group_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, code: 1, name: 1 } }],
          as: 'supplier_group',
        },
      },
      {
        $unwind: {
          path: '$supplier_group',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          'supplier_group.label': {
            $concat: ['[', '$supplier_group.code', '] ', '$supplier_group.name'],
          },
        },
      },
      { $unset: ['supplier_group_id'] },
    ]
  }

  private aggregateFilters(_id: string) {
    return [{ $match: { _id: _id } }]
  }
}
