import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyChartOfAccountCategoryOutput {
  deleted_count: number
}
export interface IDeleteManyChartOfAccountCategoryRepository {
  handle(_ids: string[]): Promise<IDeleteManyChartOfAccountCategoryOutput>
}

export class DeleteManyChartOfAccountCategoryRepository implements IDeleteManyChartOfAccountCategoryRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
