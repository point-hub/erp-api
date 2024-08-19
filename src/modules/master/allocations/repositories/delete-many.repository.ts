import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyAllocationOutput {
  deleted_count: number
}
export interface IDeleteManyAllocationRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyAllocationOutput>
}

export class DeleteManyAllocationRepository implements IDeleteManyAllocationRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyAllocationOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
