import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyItemCategoryOutput {
  deleted_count: number
}
export interface IDeleteManyItemCategoryRepository {
  handle(_ids: string[]): Promise<IDeleteManyItemCategoryOutput>
}

export class DeleteManyItemCategoryRepository implements IDeleteManyItemCategoryRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyItemCategoryOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
