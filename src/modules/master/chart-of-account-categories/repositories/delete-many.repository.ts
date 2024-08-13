import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyChartOfAccountCategoryOutput extends IDeleteManyOutput {}
export interface IDeleteManyChartOfAccountCategoryRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyChartOfAccountCategoryOutput>
}

export class DeleteManyChartOfAccountCategoryRepository implements IDeleteManyChartOfAccountCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
