import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyItemOutput {
  deleted_count: number
}
export interface IDeleteManyItemRepository {
  handle(_ids: string[]): Promise<IDeleteManyItemOutput>
}

export class DeleteManyItemRepository implements IDeleteManyItemRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyItemOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
