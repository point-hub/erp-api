import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteRoleOutput {
  deleted_count: number
}
export interface IDeleteRoleRepository {
  handle(_id: string): Promise<IDeleteRoleOutput>
}

export class DeleteRoleRepository implements IDeleteRoleRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteRoleOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
