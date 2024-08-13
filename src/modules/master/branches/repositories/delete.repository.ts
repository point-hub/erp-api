import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteBranchOutput extends IDeleteOutput {}
export interface IDeleteBranchRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteBranchOutput>
}

export class DeleteBranchRepository implements IDeleteBranchRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteBranchOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
