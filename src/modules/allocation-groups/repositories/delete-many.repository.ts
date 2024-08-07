import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyAllocationGroupOutput extends IDeleteManyOutput {}
export interface IDeleteManyAllocationGroupRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyAllocationGroupOutput>
}

export class DeleteManyRepository implements IDeleteManyAllocationGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyAllocationGroupOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
