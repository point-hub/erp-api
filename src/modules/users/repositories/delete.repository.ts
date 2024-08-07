import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteUserOutput extends IDeleteOutput {}
export interface IDeleteUserRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteUserOutput>
}

export class DeleteRepository implements IDeleteUserRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteUserOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
