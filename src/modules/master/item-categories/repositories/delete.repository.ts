import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteItemCategoryOutput {
  deleted_count: number
}
export interface IDeleteItemCategoryRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteItemCategoryOutput>
}

export class DeleteItemCategoryRepository implements IDeleteItemCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteItemCategoryOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
