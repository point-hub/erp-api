import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyAllocationOutput {
  deleted_count: number
}

export interface IDeleteManyAllocationRepository {
  handle(_ids: string[]): Promise<IDeleteManyAllocationOutput>
}

export class DeleteManyAllocationRepository implements IDeleteManyAllocationRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyAllocationOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
