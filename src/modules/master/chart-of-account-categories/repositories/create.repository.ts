import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateChartOfAccountCategoryOutput extends ICreateOutput {}
export interface ICreateChartOfAccountCategoryRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateChartOfAccountCategoryOutput>
}

export class CreateChartOfAccountCategoryRepository implements ICreateChartOfAccountCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
