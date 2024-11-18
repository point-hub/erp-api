import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyCounterOutput {
  deleted_count: number
}

export interface IDeleteManyCounterRepository {
  handle(_ids: string[]): Promise<IDeleteManyCounterOutput>
}

export class DeleteManyCounterRepository implements IDeleteManyCounterRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyCounterOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
