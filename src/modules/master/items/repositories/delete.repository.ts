import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteItemOutput extends IDeleteOutput {}
export interface IDeleteItemRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteItemOutput>
}

export class DeleteItemRepository implements IDeleteItemRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteItemOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
