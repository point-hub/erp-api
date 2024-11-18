import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyRoleOutput {
  deleted_count: number
}
export interface IDeleteManyRoleRepository {
  handle(_ids: string[]): Promise<IDeleteManyRoleOutput>
}

export class DeleteManyRoleRepository implements IDeleteManyRoleRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyRoleOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
