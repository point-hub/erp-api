import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteProcessOutput {
  deleted_count: number
}
export interface IDeleteProcessRepository {
  handle(_id: string): Promise<IDeleteProcessOutput>
}

export class DeleteProcessRepository implements IDeleteProcessRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteProcessOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
