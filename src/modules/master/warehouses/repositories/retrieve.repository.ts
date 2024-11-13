import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthReference } from '@/modules/master/users/interface'

import { collectionName } from '../entity'

interface IBranch {
  _id: string
  label: string
  code: string
  name: string
}

export interface IRetrieveWarehouseOutput {
  _id: string
  label: string
  code: string
  name: string
  address: string
  phone: string
  notes: string
  branch: IBranch
  created_by: IAuthReference
  updated_by: IAuthReference
  created_date: Date
  updated_date: Date
}
export interface IRetrieveWarehouseRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveWarehouseOutput>
}

export class RetrieveWarehouseRepository implements IRetrieveWarehouseRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveWarehouseOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(_id))
    pipeline.push(...this.aggregateJoinBranch())
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, options)

    return {
      _id: `${response.data[0]._id}`,
      label: `${response.data[0].code}`,
      code: `${response.data[0].code}`,
      name: `${response.data[0].name}`,
      address: `${response.data[0].address ?? ''}`,
      phone: `${response.data[0].phone ?? ''}`,
      notes: `${response.data[0].notes ?? ''}`,
      branch: response.data[0].branch as IBranch,
      created_by: response.data[0].created_by as IAuthReference,
      updated_by: response.data[0].updated_by as IAuthReference,
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

  private aggregateJoinBranch() {
    return [
      {
        $lookup: {
          from: 'branches',
          localField: 'branch_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, code: 1, name: 1 } }],
          as: 'branch',
        },
      },
      {
        $unwind: {
          path: '$branch',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          'branch.label': {
            $concat: ['[', '$branch.code', '] ', '$branch.name'],
          },
        },
      },
      { $unset: ['branch_id'] },
    ]
  }

  private aggregateFilters(_id: string) {
    return [{ $match: { _id: _id } }]
  }
}
