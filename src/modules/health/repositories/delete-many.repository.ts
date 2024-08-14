import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyHealthOutput extends IDeleteManyOutput {}
export interface IDeleteManyHealthRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyHealthOutput>
}

export class DeleteManyHealthRepository implements IDeleteManyHealthRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyHealthOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
