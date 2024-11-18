import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteBranchOutput {
  deleted_count: number
}
export interface IDeleteBranchRepository {
  handle(_id: string): Promise<IDeleteBranchOutput>
}

export class DeleteBranchRepository implements IDeleteBranchRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteBranchOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
