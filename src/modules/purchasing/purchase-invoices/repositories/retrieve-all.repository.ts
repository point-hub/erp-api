import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { collectionName } from '../entity'
import { IRetrievePurchaseInvoiceOutput } from './retrieve.repository'

export interface IRetrieveAllPurchaseInvoiceOutput {
  data: IRetrievePurchaseInvoiceOutput[]
  pagination: IPagination
}
export interface IRetrieveAllPurchaseInvoiceRepository {
  handle(data: { query: IQuery; auth: IAuth }, options?: unknown): Promise<IRetrieveAllPurchaseInvoiceOutput>
}
export interface IData {
  query: IQuery
  auth: IAuth
}

export class RetrieveAllPurchaseInvoiceRepository implements IRetrieveAllPurchaseInvoiceRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(data: IData, options?: unknown): Promise<IRetrieveAllPurchaseInvoiceOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(data.auth, data.query))

    const response = await this.database.collection(collectionName).aggregate(pipeline, data.query, options)

    return {
      data: response.data as unknown as IRetrievePurchaseInvoiceOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateFilters(auth: IAuth, query: IQuery) {
    const filtersAnd = []

    if (query.filter?.search) {
      const filtersOr = []
      filtersOr.push({ form_number: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ payment_type: { $regex: query.filter?.search, $options: 'i' } })
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

    if (query.filter?.required_down_payment !== undefined) {
      if (query.filter?.required_down_payment === true) {
        filtersAnd.push({ required_down_payment: { $eq: JSON.parse(query.filter?.required_down_payment) } })
      } else {
        filtersAnd.push({
          $or: [{ required_down_payment: { $exists: false } }, { required_down_payment: { $eq: false } }],
        })
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filtersAnd.push({ 'branch._id': { $in: auth.branches.map((item: any) => item._id) } })
    filtersAnd.push({ is_revised: false })

    console.log(filtersAnd)

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
