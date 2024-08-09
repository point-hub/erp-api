import type { IAggregateOutput, IAggregateRepository, IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveChartOfAccountTypeOutput } from './retrieve.repository'

export interface IRetrieveAllChartOfAccountTypeOutput extends IAggregateOutput {
  data: IRetrieveChartOfAccountTypeOutput[]
  pagination: IPagination
}
export interface IRetrieveAllChartOfAccountTypeRepository extends IAggregateRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllChartOfAccountTypeOutput>
}

export class RetrieveAllChartOfAccountTypeRepository implements IRetrieveAllChartOfAccountTypeRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllChartOfAccountTypeOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push({
      $lookup: {
        from: 'branches',
        localField: 'branch_id',
        foreignField: '_id',
        pipeline: [{ $project: { code: 1, name: 1 } }],
        as: 'branch',
      },
    })

    pipeline.push({
      $set: {
        branch: {
          $arrayElemAt: ['$branch', 0],
        },
      },
    })
    pipeline.push({ $unset: ['branch_id'] })

    const filtersAnd = [] // filter keys using "and" logic
    const filtersOr = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({
        $or: [
          { 'branch.code': { $regex: query.filter?.search, $options: 'i' } },
          { 'branch.name': { $regex: query.filter?.search, $options: 'i' } },
        ],
      })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.code) filtersAnd.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.branch)
      filtersAnd.push({
        $or: [
          { 'branch.code': { $regex: query.filter?.branch, $options: 'i' } },
          { 'branch.name': { $regex: query.filter?.branch, $options: 'i' } },
        ],
      })

    if (filtersAnd.length) {
      pipeline.push({ $match: { $and: filtersAnd } })
    }

    const response = await this.database.collection(this.collection).aggregate(pipeline, query, options)

    return {
      data: response.data as IRetrieveChartOfAccountTypeOutput[],
      pagination: response.pagination,
    }
  }
}
