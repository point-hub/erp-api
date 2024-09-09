import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveUserOutput } from './retrieve.repository'

export interface IRetrieveAuthorizedUsersOutput {
  data: IRetrieveUserOutput[]
  pagination: IPagination
}
export interface IRetrieveAuthorizedUsersRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAuthorizedUsersOutput>
}

export class RetrieveAuthorizedUsersRepository implements IRetrieveAuthorizedUsersRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAuthorizedUsersOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push({
      $lookup: {
        from: 'roles',
        localField: 'role_id',
        foreignField: '_id',
        pipeline: [{ $project: { code: 1, name: 1, permission: 1 } }],
        as: 'role',
      },
    })

    pipeline.push({
      $unwind: {
        path: '$role',
        preserveNullAndEmptyArrays: true,
      },
    })

    pipeline.push({
      $addFields: {
        label: '$name',
      },
    })

    pipeline.push({ $match: { [query.filter?.permission]: true } })

    const response = await this.database.collection(this.collection).aggregate(pipeline, { page_size: 9999 }, options)

    return {
      data: response.data as unknown as IRetrieveUserOutput[],
      pagination: response.pagination,
    }
  }
}
