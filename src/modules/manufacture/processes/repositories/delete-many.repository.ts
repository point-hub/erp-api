import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyProcessOutput {
  deleted_count: number
}
export interface IDeleteManyProcessRepository {
  handle(_ids: string[]): Promise<IDeleteManyProcessOutput>
}

export class DeleteManyProcessRepository implements IDeleteManyProcessRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyProcessOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
