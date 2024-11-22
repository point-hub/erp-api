import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteChartOfAccountCategoryOutput {
  deleted_count: number
}
export interface IDeleteChartOfAccountCategoryRepository {
  handle(_id: string): Promise<IDeleteChartOfAccountCategoryOutput>
}

export class DeleteChartOfAccountCategoryRepository implements IDeleteChartOfAccountCategoryRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
