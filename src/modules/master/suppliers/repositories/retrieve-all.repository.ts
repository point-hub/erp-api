import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveSupplierOutput } from './retrieve.repository'

export interface IRetrieveAllSupplierOutput {
  data: IRetrieveSupplierOutput[]
  pagination: IPagination
}
export interface IRetrieveAllSupplierRepository {
  handle(query: IQuery): Promise<IRetrieveAllSupplierOutput>
}

export class RetrieveAllSupplierRepository implements IRetrieveAllSupplierRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllSupplierOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(query))

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, this.options)

    return {
      data: response.data as unknown as IRetrieveSupplierOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = []

    if (query.filter?.search) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ address: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ phone: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'supplier_group.code': { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'supplier_group.name': { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.label) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.label, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.label, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.code) filtersAnd.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.address) filtersAnd.push({ address: { $regex: query.filter?.address, $options: 'i' } })
    if (query.filter?.phone) filtersAnd.push({ phone: { $regex: query.filter?.phone, $options: 'i' } })
    if (query.filter?.supplier_group_id)
      filtersAnd.push({ 'supplier_group._id': { $eq: query.filter?.supplier_group_id } })
    if (query.filter?.supplier_group)
      filtersAnd.push({
        $or: [
          { 'supplier_group.code': { $regex: query.filter?.supplier_group, $options: 'i' } },
          { 'supplier_group.name': { $regex: query.filter?.supplier_group, $options: 'i' } },
        ],
      })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
