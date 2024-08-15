import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateChartOfAccountTypeOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateChartOfAccountTypeRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateChartOfAccountTypeOutput>
}

export class UpdateChartOfAccountTypeRepository implements IUpdateChartOfAccountTypeRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
