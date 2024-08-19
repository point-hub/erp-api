import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyItemCategoryOutput {
  deleted_count: number
}
export interface IDeleteManyItemCategoryRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyItemCategoryOutput>
}

export class DeleteManyItemCategoryRepository implements IDeleteManyItemCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyItemCategoryOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
