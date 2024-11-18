import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyBranchOutput {
  deleted_count: number
}
export interface IDeleteManyBranchRepository {
  handle(_ids: string[]): Promise<IDeleteManyBranchOutput>
}

export class DeleteManyBranchRepository implements IDeleteManyBranchRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyBranchOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
