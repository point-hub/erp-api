import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyUserOutput extends IDeleteManyOutput {}
export interface IDeleteManyUserRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyUserOutput>
}

export class DeleteManyRepository implements IDeleteManyUserRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyUserOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
