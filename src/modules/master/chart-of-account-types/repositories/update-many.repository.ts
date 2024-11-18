import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyChartOfAccountTypeOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyChartOfAccountTypeRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyChartOfAccountTypeOutput>
}

export class UpdateManyChartOfAccountTypeRepository implements IUpdateManyChartOfAccountTypeRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(
    filter: IDocument,
    document: IDocument,
    options?: unknown,
  ): Promise<IUpdateManyChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, this.options)
  }
}
