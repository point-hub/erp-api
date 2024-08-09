import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateChartOfAccountCategoryOutput extends IUpdateOutput {}
export interface IUpdateChartOfAccountCategoryRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateChartOfAccountCategoryOutput>
}

export class UpdateChartOfAccountCategoryRepository implements IUpdateChartOfAccountCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
