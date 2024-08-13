import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyChartOfAccountCategoryOutput extends IUpdateManyOutput {}
export interface IUpdateManyChartOfAccountCategoryRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyChartOfAccountCategoryOutput>
}

export class UpdateManyChartOfAccountCategoryRepository implements IUpdateManyChartOfAccountCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(
    filter: IDocument,
    document: IDocument,
    options?: unknown,
  ): Promise<IUpdateManyChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
