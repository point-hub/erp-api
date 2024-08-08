import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeletePermissionOutput extends IDeleteOutput {}
export interface IDeletePermissionRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeletePermissionOutput>
}

export class DeletePermissionRepository implements IDeletePermissionRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeletePermissionOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
