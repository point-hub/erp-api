import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteAllocationGroupOutput extends IDeleteOutput {}
export interface IDeleteAllocationGroupRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteAllocationGroupOutput>
}

export class DeleteAllocationGroupRepository implements IDeleteAllocationGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteAllocationGroupOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
