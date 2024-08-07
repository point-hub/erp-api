import type { IAggregateOutput, IAggregateRepository, IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveSupplierOutput } from './retrieve.repository'

export interface IRetrieveAllSupplierOutput extends IAggregateOutput {
  data: IRetrieveSupplierOutput[]
  pagination: IPagination
}
export interface IRetrieveAllSupplierRepository extends IAggregateRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllSupplierOutput>
}

export class RetrieveAllSupplierRepository implements IRetrieveAllSupplierRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllSupplierOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push({
      $lookup: {
        from: 'supplier_groups',
        localField: 'supplier_group_id',
        foreignField: '_id',
        pipeline: [{ $project: { code: 1, name: 1 } }],
        as: 'supplier_group',
      },
    })

    pipeline.push({
      $set: {
        supplier_group: {
          $arrayElemAt: ['$supplier_group', 0],
        },
      },
    })
    pipeline.push({ $unset: ['supplier_group_id'] })

    const filtersAnd = [] // filter keys using "and" logic
    const filtersOr = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({
        $or: [
          { 'supplier_group.code': { $regex: query.filter?.search, $options: 'i' } },
          { 'supplier_group.name': { $regex: query.filter?.search, $options: 'i' } },
        ],
      })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.code) filtersAnd.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.supplier_group)
      filtersAnd.push({
        $or: [
          { 'supplier_group.code': { $regex: query.filter?.supplier_group, $options: 'i' } },
          { 'supplier_group.name': { $regex: query.filter?.supplier_group, $options: 'i' } },
        ],
      })

    if (filtersAnd.length) {
      pipeline.push({ $match: { $and: filtersAnd } })
    }

    const response = await this.database.collection(this.collection).aggregate(pipeline, query, options)

    return {
      data: response.data as IRetrieveSupplierOutput[],
      pagination: response.pagination,
    }
  }
}
