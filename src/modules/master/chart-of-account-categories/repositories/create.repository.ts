import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateChartOfAccountCategoryOutput {
  inserted_id: string
}
export interface ICreateChartOfAccountCategoryRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateChartOfAccountCategoryOutput>
}

export class CreateChartOfAccountCategoryRepository implements ICreateChartOfAccountCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
