import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyPermissionOutput extends IDeleteManyOutput {}
export interface IDeleteManyPermissionRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyPermissionOutput>
}

export class DeleteManyPermissionRepository implements IDeleteManyPermissionRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyPermissionOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
