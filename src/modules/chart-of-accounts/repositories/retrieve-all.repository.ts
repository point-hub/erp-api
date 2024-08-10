import type { IAggregateOutput, IAggregateRepository, IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveChartOfAccountOutput } from './retrieve.repository'

export interface IRetrieveAllChartOfAccountOutput extends IAggregateOutput {
  data: IRetrieveChartOfAccountOutput[]
  pagination: IPagination
}
export interface IRetrieveAllChartOfAccountRepository extends IAggregateRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllChartOfAccountOutput>
}

export class RetrieveAllChartOfAccountRepository implements IRetrieveAllChartOfAccountRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllChartOfAccountOutput> {
    const pipeline: IPipeline[] = []

    // join category
    pipeline.push({
      $lookup: {
        from: 'chart_of_account_categories',
        localField: 'category_id',
        foreignField: '_id',
        pipeline: [{ $project: { _id: 1, type_id: 1, name: 1 } }],
        as: 'category',
      },
    })
    pipeline.push({
      $set: {
        category: {
          $arrayElemAt: ['$category', 0],
        },
      },
    })
    pipeline.push({ $unset: ['category_id'] })

    // join type
    pipeline.push({
      $lookup: {
        from: 'chart_of_account_types',
        localField: 'type_id',
        foreignField: 'category.type_id',
        pipeline: [{ $project: { _id: 1, name: 1 } }],
        as: 'type',
      },
    })
    pipeline.push({
      $set: {
        type: {
          $arrayElemAt: ['$type', 0],
        },
      },
    })
    pipeline.push({ $unset: ['category.type_id'] })

    pipeline.push({
      $addFields: {
        number: { $toString: '$number' },
      },
    })

    const filtersAnd = [] // filter keys using "and" logic
    const filtersOr = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filtersOr.push({ number: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ subledger: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ type: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ category: { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }
    if (query.filter?.number) filtersAnd.push({ number: { $regex: query.filter?.number, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.subledger) filtersAnd.push({ subledger: { $regex: query.filter?.subledger, $options: 'i' } })
    if (query.filter?.type) filtersAnd.push({ 'type.name': { $regex: query.filter?.type, $options: 'i' } })
    if (query.filter?.category) filtersAnd.push({ 'category.name': { $regex: query.filter?.category, $options: 'i' } })

    if (filtersAnd.length) {
      pipeline.push({ $match: { $and: filtersAnd } })
    }

    const response = await this.database.collection(this.collection).aggregate(pipeline, query, options)

    return {
      data: response.data as IRetrieveChartOfAccountOutput[],
      pagination: response.pagination,
    }
  }
}
