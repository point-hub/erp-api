import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteChartOfAccountCategoryOutput {
  deleted_count: number
}
export interface IDeleteChartOfAccountCategoryRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteChartOfAccountCategoryOutput>
}

export class DeleteChartOfAccountCategoryRepository implements IDeleteChartOfAccountCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
