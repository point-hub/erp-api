import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyAllocationOutput extends IDeleteManyOutput {}
export interface IDeleteManyAllocationRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyAllocationOutput>
}

export class DeleteManyAllocationRepository implements IDeleteManyAllocationRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyAllocationOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
