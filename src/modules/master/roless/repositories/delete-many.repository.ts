import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyRoleOutput extends IDeleteManyOutput {}
export interface IDeleteManyRoleRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyRoleOutput>
}

export class DeleteManyRoleRepository implements IDeleteManyRoleRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyRoleOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
