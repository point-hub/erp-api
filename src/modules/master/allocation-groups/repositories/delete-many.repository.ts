import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyAllocationGroupOutput {
  deleted_count: number
}

export interface IDeleteManyAllocationGroupRepository {
  handle(_ids: string[]): Promise<IDeleteManyAllocationGroupOutput>
}

export class DeleteManyAllocationGroupRepository implements IDeleteManyAllocationGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyAllocationGroupOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
