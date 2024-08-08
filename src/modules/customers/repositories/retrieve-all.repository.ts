import type { IAggregateOutput, IAggregateRepository, IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveCustomerOutput } from './retrieve.repository'

export interface IRetrieveAllCustomerOutput extends IAggregateOutput {
  data: IRetrieveCustomerOutput[]
  pagination: IPagination
}
export interface IRetrieveAllCustomerRepository extends IAggregateRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllCustomerOutput>
}

export class RetrieveAllCustomerRepository implements IRetrieveAllCustomerRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllCustomerOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push({
      $lookup: {
        from: 'customer_groups',
        localField: 'customer_group_id',
        foreignField: '_id',
        pipeline: [{ $project: { code: 1, name: 1 } }],
        as: 'customer_group',
      },
    })

    pipeline.push({
      $set: {
        customer_group: {
          $arrayElemAt: ['$customer_group', 0],
        },
      },
    })
    pipeline.push({ $unset: ['customer_group_id'] })

    const filtersAnd = [] // filter keys using "and" logic
    const filtersOr = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({
        $or: [
          { 'customer_group.code': { $regex: query.filter?.search, $options: 'i' } },
          { 'customer_group.name': { $regex: query.filter?.search, $options: 'i' } },
        ],
      })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.code) filtersAnd.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.customer_group)
      filtersAnd.push({
        $or: [
          { 'customer_group.code': { $regex: query.filter?.customer_group, $options: 'i' } },
          { 'customer_group.name': { $regex: query.filter?.customer_group, $options: 'i' } },
        ],
      })

    if (filtersAnd.length) {
      pipeline.push({ $match: { $and: filtersAnd } })
    }

    const response = await this.database.collection(this.collection).aggregate(pipeline, query, options)

    return {
      data: response.data as IRetrieveCustomerOutput[],
      pagination: response.pagination,
    }
  }
}
