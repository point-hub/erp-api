import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyItemOutput extends IDeleteManyOutput {}
export interface IDeleteManyItemRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyItemOutput>
}

export class DeleteManyItemRepository implements IDeleteManyItemRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyItemOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
