import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateChartOfAccountCategoryOutput extends IUpdateOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateChartOfAccountCategoryRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateChartOfAccountCategoryOutput>
}

export class UpdateChartOfAccountCategoryRepository implements IUpdateChartOfAccountCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
