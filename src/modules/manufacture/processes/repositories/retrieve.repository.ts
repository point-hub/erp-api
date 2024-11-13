import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthReference } from '@/modules/master/users/interface'

import { collectionName } from '../entity'

export interface IRetrieveProcessOutput {
  _id: string
  code: string
  name: string
  notes: string
  created_by: IAuthReference
  updated_by: IAuthReference
  created_date: Date
  updated_date: Date
}
export interface IRetrieveProcessRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveProcessOutput>
}

export class RetrieveProcessRepository implements IRetrieveProcessRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveProcessOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(_id))
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, options)
    const created_by = response.data[0].created_by as IAuthReference
    const updated_by = response.data[0].updated_by as IAuthReference

    return {
      _id: response.data[0]._id as string,
      code: response.data[0].code as string,
      name: response.data[0].name as string,
      notes: response.data[0].notes as string,
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

  private aggregateFilters(_id: string) {
    return [{ $match: { _id: _id } }]
  }
}
