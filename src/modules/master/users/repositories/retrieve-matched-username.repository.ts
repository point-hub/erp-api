import type { IDatabase, IPipeline, IQuery, IRetrieveAllOutput } from '@point-hub/papi'
import { IAggregateRepository } from '@point-hub/papi'
import { IAggregateOutput } from '@point-hub/papi'
import { IPagination } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRetrieveMatchedUsernameRepository extends IAggregateRepository {}

export interface IRetrieveMatcherUsernameOutput extends IAggregateOutput {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  pagination: IPagination
}

export class RetrieveMatchedUsernameRepository implements IRetrieveMatchedUsernameRepository {
  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateJoinRole())
    pipeline.push({
      $match: {
        $or: [
          {
            trimmed_username: {
              $regex: `^${query.filter?.username}$`,
              $options: 'i',
            },
          },
          {
            trimmed_email: {
              $regex: `^${query.filter?.username}$`,
              $options: 'i',
            },
          },
        ],
      },
    })

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, options)

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: response.data as any[],
      pagination: response.pagination,
    }
  }

  private aggregateJoinRole() {
    return [
      {
        $lookup: {
          from: 'roles',
          localField: 'role_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, code: 1, name: 1, permission: 1 } }],
          as: 'role',
        },
      },
      { $unwind: '$role' },
      { $unset: ['role_id'] },
    ]
  }
}
