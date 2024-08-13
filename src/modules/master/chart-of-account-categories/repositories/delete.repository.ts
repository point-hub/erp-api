import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteChartOfAccountCategoryOutput extends IDeleteOutput {}
export interface IDeleteChartOfAccountCategoryRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteChartOfAccountCategoryOutput>
}

export class DeleteChartOfAccountCategoryRepository implements IDeleteChartOfAccountCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
