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
    pipeline.push(...this.aggregateJoinDefaultBranch())
    pipeline.push(...this.aggregateJoinBranches())
    pipeline.push(...this.aggregateJoinDefaultWarehouse())
    pipeline.push(...this.aggregateJoinWarehouses())

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

  private aggregateJoinDefaultBranch() {
    return [
      {
        $lookup: {
          from: 'branches',
          localField: 'default_branch',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, code: 1, name: 1 } }],
          as: 'default_branch',
        },
      },
      { $unwind: '$default_branch' },
      {
        $addFields: {
          'default_branch.label': {
            $concat: ['[', '$default_branch.code', '] ', '$default_branch.name'],
          },
        },
      },
    ]
  }

  private aggregateJoinBranches() {
    return [
      {
        $lookup: {
          from: 'branches',
          localField: 'branches',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, code: 1, name: 1 } }],
          as: 'branches',
        },
      },
      {
        $addFields: {
          branches: {
            $map: {
              input: '$branches',
              as: 'branch',
              in: {
                $mergeObjects: [
                  '$$branch',
                  {
                    label: {
                      $concat: ['[', '$$branch.code', '] ', '$$branch.name'],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]
  }

  private aggregateJoinDefaultWarehouse() {
    return [
      {
        $lookup: {
          from: 'warehouses',
          localField: 'default_warehouse',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, code: 1, name: 1 } }],
          as: 'default_warehouse',
        },
      },
      { $unwind: '$default_warehouse' },
      {
        $addFields: {
          'default_warehouse.label': {
            $concat: ['[', '$default_warehouse.code', '] ', '$default_warehouse.name'],
          },
        },
      },
    ]
  }

  private aggregateJoinWarehouses() {
    return [
      {
        $lookup: {
          from: 'warehouses',
          localField: 'warehouses',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, code: 1, name: 1 } }],
          as: 'warehouses',
        },
      },
      {
        $addFields: {
          warehouses: {
            $map: {
              input: '$warehouses',
              as: 'warehouse',
              in: {
                $mergeObjects: [
                  '$$warehouse',
                  {
                    label: {
                      $concat: ['[', '$$warehouse.code', '] ', '$$warehouse.name'],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]
  }
}
