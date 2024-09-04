import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthBy } from '@/modules/master/users/interface'

import { collectionName } from '../entity'

export interface IRetrieveRoleOutput {
  _id: string
  label: string
  code: string
  name: string
  notes: string
  permission: { [key: string]: boolean | { [key: string]: boolean } }
  created_by: IAuthBy
  updated_by: IAuthBy
  created_date: Date
  updated_date: Date
}
export interface IRetrieveRoleRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveRoleOutput>
}

export class RetrieveRoleRepository implements IRetrieveRoleRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveRoleOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(_id))
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, options)

    return {
      _id: `${response.data[0]._id}`,
      label: `[${response.data[0].code}] ${response.data[0].name}`,
      code: `${response.data[0].code}`,
      name: `${response.data[0].name}`,
      permission: response.data[0].permission as { [key: string]: boolean | { [key: string]: boolean } },
      notes: `${response.data[0].notes ?? ''}`,
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

  private aggregateFilters(_id: string) {
    return [{ $match: { _id: _id } }]
  }
}
