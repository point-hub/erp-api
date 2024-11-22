import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyChartOfAccountOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyChartOfAccountRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyChartOfAccountOutput>
}

export class UpdateManyChartOfAccountRepository implements IUpdateManyChartOfAccountRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyChartOfAccountOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
