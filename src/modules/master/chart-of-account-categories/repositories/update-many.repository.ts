import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyChartOfAccountCategoryOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyChartOfAccountCategoryRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyChartOfAccountCategoryOutput>
}

export class UpdateManyChartOfAccountCategoryRepository implements IUpdateManyChartOfAccountCategoryRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(
    filter: IDocument,
    document: IDocument,
    options?: unknown,
  ): Promise<IUpdateManyChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, this.options)
  }
}
