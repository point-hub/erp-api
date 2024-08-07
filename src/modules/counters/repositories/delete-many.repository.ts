import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyCounterOutput extends IDeleteManyOutput {}
export interface IDeleteManyCounterRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyCounterOutput>
}

export class DeleteManyRepository implements IDeleteManyCounterRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyCounterOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
