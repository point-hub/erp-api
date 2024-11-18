import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthReference } from '@/modules/master/users/interface'

import { collectionName } from '../entity'

interface IAllocationGroup {
  _id: string
  label: string
  code: string
  name: string
}

export interface IRetrieveAllocationOutput {
  _id: string
  label: string
  code: string
  name: string
  notes: string
  allocation_group: IAllocationGroup
  created_by: IAuthReference
  updated_by: IAuthReference
  created_date: Date
  updated_date: Date
}
export interface IRetrieveAllocationRepository {
  handle(_id: string): Promise<IRetrieveAllocationOutput>
}

export class RetrieveAllocationRepository implements IRetrieveAllocationRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IRetrieveAllocationOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(_id))
    pipeline.push(...this.aggregateJoinAllocationGroup())
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, this.options)

    return {
      _id: `${response.data[0]._id}`,
      label: `[${response.data[0].code}] ${response.data[0].name}`,
      code: `${response.data[0].code}`,
      name: `${response.data[0].name}`,
      notes: `${response.data[0].notes ?? ''}`,
      allocation_group: response.data[0].allocation_group as IAllocationGroup,
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

  private aggregateJoinAllocationGroup() {
    return [
      {
        $lookup: {
          from: 'allocation_groups',
          localField: 'allocation_group_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, code: 1, name: 1 } }],
          as: 'allocation_group',
        },
      },
      {
        $unwind: {
          path: '$allocation_group',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          'allocation_group.label': {
            $concat: ['[', '$allocation_group.code', '] ', '$allocation_group.name'],
          },
        },
      },
      { $unset: ['allocation_group_id'] },
    ]
  }

  private aggregateFilters(_id: string) {
    return [{ $match: { _id: _id } }]
  }
}
