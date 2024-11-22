import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveAllocationOutput } from './retrieve.repository'

export interface IRetrieveAllAllocationOutput {
  data: IRetrieveAllocationOutput[]
  pagination: IPagination
}
export interface IRetrieveAllAllocationRepository {
  handle(query: IQuery): Promise<IRetrieveAllAllocationOutput>
}

export class RetrieveAllAllocationRepository implements IRetrieveAllAllocationRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllAllocationOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(query))

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, this.options)

    return {
      data: response.data as unknown as IRetrieveAllocationOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = []

    if (query.filter?.search) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ label: { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.code) {
      filtersAnd.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    }
    if (query.filter?.name) {
      filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    }
    if (query.filter?.label) {
      filtersAnd.push({ label: { $regex: query.filter?.label, $options: 'i' } })
    }
    if (query.filter?.['allocation_group._id']) {
      filtersAnd.push({ 'allocation_group._id': { $eq: query.filter?.allocation_group?._id } })
    }
    if (query.filter?.['allocation_group.label']) {
      filtersAnd.push({ 'allocation_group.label': { $regex: query.filter?.allocation_group?.label, $options: 'i' } })
    }

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }
}
