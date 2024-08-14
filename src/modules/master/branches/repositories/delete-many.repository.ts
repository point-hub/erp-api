import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyBranchOutput {
  deleted_count: number
}
export interface IDeleteManyBranchRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyBranchOutput>
}

export class DeleteManyBranchRepository implements IDeleteManyBranchRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyBranchOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
