import type { IAggregateOutput, IAggregateRepository, IDatabase, IDocument, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IFilter {
  user_id: string
  project_id?: string
}
export interface IRetrieveUserOutput {
  _id: string
  role: {
    code: string
    name: string
  }
  code: string
  name: string
  username: string
  email: string
  created_date: Date
  updated_date: Date
}
export interface IRetrieveUserRepository {
  handle(filter: IDocument, options?: unknown): Promise<IRetrieveUserOutput>
}

export class RetrieveUserRepository implements IRetrieveUserRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, options?: unknown): Promise<IRetrieveUserOutput> {
    const pipeline: IPipeline[] = []

    // match user
    pipeline.push({
      $match: {
        _id: filter._id,
      },
    })
    // join role
    pipeline.push({
      $lookup: {
        from: 'roles',
        localField: 'role_id',
        foreignField: '_id',
        pipeline: [{ $project: { code: 1, name: 1 } }],
        as: 'role',
      },
    })
    pipeline.push({
      $set: {
        role: {
          $arrayElemAt: ['$role', 0],
        },
      },
    })
    pipeline.push({ $unset: ['role_id'] })

    const query: IQuery = {
      page: filter.page,
      page_size: filter.page_size,
      sort: filter.sort,
    }
    const aggregateResult = await this.database.collection(collectionName).aggregate(pipeline, query, options)

    return {
      _id: aggregateResult.data[0]._id as string,
      role: aggregateResult.data[0].role as { code: string; name: string },
      code: aggregateResult.data[0].code as string,
      name: aggregateResult.data[0].name as string,
      username: aggregateResult.data[0].username as string,
      email: aggregateResult.data[0].email as string,
      created_date: aggregateResult.data[0].created_date as Date,
      updated_date: aggregateResult.data[0].updated_date as Date,
    }
  }
}
