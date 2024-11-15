import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { collectionName } from '../entity'
import { IRetrievePurchaseRequestOutput } from './retrieve.repository'

export interface IRetrieveAllPurchaseRequestOutput {
  data: IRetrievePurchaseRequestOutput[]
  pagination: IPagination
}
export interface IRetrieveAllPurchaseRequestRepository {
  handle(data: { query: IQuery; auth: IAuth }, options?: unknown): Promise<IRetrieveAllPurchaseRequestOutput>
}
export interface IData {
  query: IQuery
  auth: IAuth
}

export class RetrieveAllPurchaseRequestRepository implements IRetrieveAllPurchaseRequestRepository {
  constructor(public database: IDatabase) {}

  async handle(data: IData, options?: unknown): Promise<IRetrieveAllPurchaseRequestOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(data.auth, data.query))
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())

    const response = await this.database.collection(collectionName).aggregate(pipeline, data.query, options)

    return {
      data: response.data as unknown as IRetrievePurchaseRequestOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateJoinCreatedBy() {
    return [
      {
        $lookup: {
          from: 'users',
          localField: 'created_by',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, username: 1, name: 1, email: 1 } }],
          as: 'created_by',
        },
      },
      {
        $unwind: {
          path: '$created_by',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]
  }

  private aggregateJoinUpdatedBy() {
    return [
      {
        $lookup: {
          from: 'users',
          localField: 'updated_by',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, username: 1, name: 1, email: 1 } }],
          as: 'updated_by',
        },
      },
      {
        $unwind: {
          path: '$updated_by',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]
  }

  private aggregateFilters(auth: IAuth, query: IQuery) {
    const filtersAnd = []

    if (query.filter?.search) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ address: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ phone: { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.label) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.label, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.label, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.is_finished) filtersAnd.push({ is_finished: { $eq: JSON.parse(query.filter?.is_finished) } })
    if (query.filter?.is_deleted) filtersAnd.push({ is_deleted: { $exists: false } })
    if (query.filter?.approval_status) filtersAnd.push({ approval_status: { $eq: query.filter?.approval_status } })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filtersAnd.push({ 'branch._id': { $in: auth.branches.map((item: any) => item._id) } })
    filtersAnd.push({ is_revised: false })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
