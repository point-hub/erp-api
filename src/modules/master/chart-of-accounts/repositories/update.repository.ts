import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateChartOfAccountOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateChartOfAccountRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateChartOfAccountOutput>
}

export class UpdateChartOfAccountRepository implements IUpdateChartOfAccountRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateChartOfAccountOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
