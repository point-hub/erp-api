import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateChartOfAccountCategoryOutput {
  inserted_id: string
}
export interface ICreateChartOfAccountCategoryRepository {
  handle(document: IDocument): Promise<ICreateChartOfAccountCategoryOutput>
}

export class CreateChartOfAccountCategoryRepository implements ICreateChartOfAccountCategoryRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
