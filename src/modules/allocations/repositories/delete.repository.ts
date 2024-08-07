import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteAllocationOutput extends IDeleteOutput {}
export interface IDeleteAllocationRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteAllocationOutput>
}

export class DeleteAllocationRepository implements IDeleteAllocationRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteAllocationOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
