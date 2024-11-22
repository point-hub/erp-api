import type { IAggregateOutput, IAggregateRepository, IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveSettingJournalOutput } from './retrieve.repository'

export interface IRetrieveAllSettingJournalOutput extends IAggregateOutput {
  data: IRetrieveSettingJournalOutput[]
  pagination: IPagination
}
export interface IRetrieveAllSettingJournalRepository extends IAggregateRepository {
  handle(query: IQuery): Promise<IRetrieveAllSettingJournalOutput>
}

export class RetrieveAllSettingJournalRepository implements IRetrieveAllSettingJournalRepository {
  public collection = collectionName

  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllSettingJournalOutput> {
    const pipeline: IPipeline[] = []

    const filtersAnd = [] // filter keys using "and" logic
    const filtersOr = [] // filter keys using "or" logic

    if (query.filter?.search) {
      filtersOr.push({ module: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ feature: { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.module) filtersAnd.push({ module: { $regex: query.filter?.module, $options: 'i' } })
    if (query.filter?.feature) filtersAnd.push({ feature: { $regex: query.filter?.feature, $options: 'i' } })

    if (filtersAnd.length) {
      pipeline.push({ $match: { $and: filtersAnd } })
    }

    const response = await this.database.collection(this.collection).aggregate(pipeline, query, this.options)

    return {
      data: response.data as IRetrieveSettingJournalOutput[],
      pagination: response.pagination,
    }
  }
}
