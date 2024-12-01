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
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(data: IData, options?: unknown): Promise<IRetrieveAllPurchaseRequestOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(data.auth, data.query))

    const response = await this.database.collection(collectionName).aggregate(pipeline, data.query, options)

    return {
      data: response.data as unknown as IRetrievePurchaseRequestOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateFilters(auth: IAuth, query: IQuery) {
    const filtersAnd = []

    if (query.filter?.search) {
      const filtersOr = []
      filtersOr.push({ form_number: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ [`details.item.label`]: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ [`details.item.notes`]: { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.label) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.label, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.label, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.is_finished) filtersAnd.push({ is_finished: { $eq: JSON.parse(query.filter?.is_finished) } })
    if (query.filter?.is_revised) filtersAnd.push({ is_revised: { $eq: JSON.parse(query.filter?.is_revised) } })
    if (query.filter?.is_deleted)
      filtersAnd.push({ $or: [{ is_deleted: { $exists: false } }, { is_deleted: { $eq: false } }] })
    if (query.filter?.approval_status) filtersAnd.push({ approval_status: { $eq: query.filter?.approval_status } })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filtersAnd.push({ 'branch._id': { $in: auth.branches.map((item: any) => item._id) } })

    if (!filtersAnd.length) {
      return []
    }
    console.log(filtersAnd)
    return [{ $match: { $and: filtersAnd } }]
  }
}
