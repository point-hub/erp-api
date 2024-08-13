import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteRoleOutput extends IDeleteOutput {}
export interface IDeleteRoleRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteRoleOutput>
}

export class DeleteRoleRepository implements IDeleteRoleRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteRoleOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
