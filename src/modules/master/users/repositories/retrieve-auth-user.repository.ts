import type { IAggregateOutput, IAggregateRepository, IDatabase, IDocument, IPipeline } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IFilter {
  user_id: string
  project_id?: string
}
export interface IRetrieveAuthUserOutput extends IAggregateOutput {
  data: { [key: string]: unknown }[]
}
export interface IRetrieveAuthUserRepository extends IAggregateRepository {
  handle(filter: IDocument, options?: unknown): Promise<IRetrieveAuthUserOutput>
}

export class RetrieveAuthUserRepository implements IRetrieveAuthUserRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, options?: unknown): Promise<IAggregateOutput> {
    const pipeline: IPipeline[] = []

    // match user
    pipeline.push({
      $match: {
        _id: filter.user_id,
      },
    })

    pipeline.push(...this.aggregateJoinRole())

    const aggregateResult = await this.database.collection(collectionName).aggregate(pipeline, {}, options)

    return {
      data: [
        {
          _id: aggregateResult.data[0]._id,
          name: aggregateResult.data[0].name,
          email: aggregateResult.data[0].email,
          username: aggregateResult.data[0].username,
          role: aggregateResult.data[0].role,
          default_branch: aggregateResult.data[0].default_branch,
          branches: aggregateResult.data[0].branches,
          default_warehouse: aggregateResult.data[0].default_warehouse,
          warehouses: aggregateResult.data[0].warehouses,
        },
      ],
      pagination: aggregateResult.pagination,
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
