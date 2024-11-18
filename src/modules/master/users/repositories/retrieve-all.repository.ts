import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveUserOutput } from './retrieve.repository'

export interface IRetrieveAllUserOutput {
  data: IRetrieveUserOutput[]
  pagination: IPagination
}

export interface IRetrieveAllUserRepository {
  handle(query: IQuery): Promise<IRetrieveAllUserOutput>
}

export class RetrieveAllUserRepository implements IRetrieveAllUserRepository {
  public collection = collectionName

  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllUserOutput> {
    const pipeline: IPipeline[] = []

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

    const filtersAnd = [] // filter keys using "and" logic
    const filtersOr = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({
        $or: [
          { 'role.code': { $regex: query.filter?.search, $options: 'i' } },
          { 'role.name': { $regex: query.filter?.search, $options: 'i' } },
        ],
      })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.code) filtersAnd.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.role_id) filtersAnd.push({ 'role._id': { $eq: query.filter?.role_id } })
    if (query.filter?.role)
      filtersAnd.push({
        $or: [
          { 'role.code': { $regex: query.filter?.role, $options: 'i' } },
          { 'role.name': { $regex: query.filter?.role, $options: 'i' } },
        ],
      })

    if (filtersAnd.length) {
      pipeline.push({ $match: { $and: filtersAnd } })
    }

    const response = await this.database.collection(this.collection).aggregate(pipeline, query, this.options)

    return {
      data: response.data as unknown as IRetrieveUserOutput[],
      pagination: response.pagination,
    }
  }
}
