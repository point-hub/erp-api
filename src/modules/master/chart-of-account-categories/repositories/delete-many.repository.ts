import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyChartOfAccountCategoryOutput {
  deleted_count: number
}
export interface IDeleteManyChartOfAccountCategoryRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyChartOfAccountCategoryOutput>
}

export class DeleteManyChartOfAccountCategoryRepository implements IDeleteManyChartOfAccountCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
