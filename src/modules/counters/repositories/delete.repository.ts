import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteCounterOutput extends IDeleteOutput {}
export interface IDeleteCounterRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteCounterOutput>
}

export class DeleteCounterRepository implements IDeleteCounterRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteCounterOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
