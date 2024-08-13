import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteItemCategoryOutput extends IDeleteOutput {}
export interface IDeleteItemCategoryRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteItemCategoryOutput>
}

export class DeleteItemCategoryRepository implements IDeleteItemCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteItemCategoryOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
