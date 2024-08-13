import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyItemCategoryOutput extends IDeleteManyOutput {}
export interface IDeleteManyItemCategoryRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyItemCategoryOutput>
}

export class DeleteManyItemCategoryRepository implements IDeleteManyItemCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyItemCategoryOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
