import type { IDatabase, IDocument, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveMatcherUsernameOutput {
  data: IDocument[]
  pagination: IPagination
}

export interface IRetrieveMatchedUsernameRepository {
  handle(filter: IDocument): Promise<IRetrieveMatcherUsernameOutput>
}

export class RetrieveMatchedUsernameRepository implements IRetrieveMatchedUsernameRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveMatcherUsernameOutput> {
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

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, this.options)

    return {
      data: response.data,
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
      {
        $unwind: {
          path: '$role',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          'role.label': {
            $concat: ['[', '$role.code', '] ', '$role.name'],
          },
        },
      },
      { $unset: ['role_id'] },
    ]
  }
}
