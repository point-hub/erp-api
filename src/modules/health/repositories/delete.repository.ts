import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteHealthOutput extends IDeleteOutput {}
export interface IDeleteHealthRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteHealthOutput>
}

export class DeleteHealthRepository implements IDeleteHealthRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteHealthOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
