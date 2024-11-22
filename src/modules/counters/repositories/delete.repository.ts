import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteCounterOutput {
  deleted_count: number
}

export interface IDeleteCounterRepository {
  handle(_id: string): Promise<IDeleteCounterOutput>
}

export class DeleteCounterRepository implements IDeleteCounterRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteCounterOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
