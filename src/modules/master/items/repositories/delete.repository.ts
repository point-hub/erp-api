import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteItemOutput {
  deleted_count: number
}
export interface IDeleteItemRepository {
  handle(_id: string): Promise<IDeleteItemOutput>
}

export class DeleteItemRepository implements IDeleteItemRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteItemOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
