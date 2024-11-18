import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteAllocationOutput {
  deleted_count: number
}
export interface IDeleteAllocationRepository {
  handle(_id: string): Promise<IDeleteAllocationOutput>
}

export class DeleteAllocationRepository implements IDeleteAllocationRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteAllocationOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
