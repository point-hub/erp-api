import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyProcessOutput {
  deleted_count: number
}
export interface IDeleteManyProcessRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyProcessOutput>
}

export class DeleteManyProcessRepository implements IDeleteManyProcessRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyProcessOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
