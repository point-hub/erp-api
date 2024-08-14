import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteProcessOutput {
  deleted_count: number
}
export interface IDeleteProcessRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteProcessOutput>
}

export class DeleteProcessRepository implements IDeleteProcessRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteProcessOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
