import type { IAggregateOutput, IAggregateRepository, IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'
import { addDays } from 'date-fns'

import { collectionName } from '../entity'
import { IRetrieveWarehouseOutput } from './retrieve.repository'

export interface IRetrieveAllWarehouseOutput extends IAggregateOutput {
  data: IRetrieveWarehouseOutput[]
  pagination: IPagination
}
export interface IRetrieveAllWarehouseRepository extends IAggregateRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllWarehouseOutput>
}

export class RetrieveAllWarehouseRepository implements IRetrieveAllWarehouseRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllWarehouseOutput> {
    const pipeline: IPipeline[] = []

    const filters = [] // filter keys using "and" logic
    const filterAll = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filterAll.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filterAll.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filters.push({ $or: filterAll })
    }

    if (query.filter?.name) {
      filters.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    }

    if (query.filter?.created_date) {
      filters.push({
        $and: [
          {
            created_date: {
              $gte: new Date(query.filter.created_date),
            },
          },
          {
            created_date: {
              $lt: addDays(new Date(query.filter.created_date), 1),
            },
          },
        ],
      })
    }

    if (filters.length) {
      pipeline.push({ $match: { $and: filters } })
    }

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

    const response = await this.database.collection(this.collection).aggregate(pipeline, query, options)

    return {
      data: response.data as IRetrieveWarehouseOutput[],
      pagination: response.pagination,
    }
  }
}
