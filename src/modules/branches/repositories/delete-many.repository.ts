import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyBranchOutput extends IDeleteManyOutput {}
export interface IDeleteManyBranchRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyBranchOutput>
}

export class DeleteManyRepository implements IDeleteManyBranchRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyBranchOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
