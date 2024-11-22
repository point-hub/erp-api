import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteAllocationGroupOutput {
  deleted_count: number
}

export interface IDeleteAllocationGroupRepository {
  handle(_id: string): Promise<IDeleteAllocationGroupOutput>
}

export class DeleteAllocationGroupRepository implements IDeleteAllocationGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteAllocationGroupOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
