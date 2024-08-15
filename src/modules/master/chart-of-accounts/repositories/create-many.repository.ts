import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyChartOfAccountOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyChartOfAccountRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyChartOfAccountOutput>
}

export class CreateManyChartOfAccountRepository implements ICreateManyChartOfAccountRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyChartOfAccountOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
