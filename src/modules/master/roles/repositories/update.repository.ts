import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateRoleOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateRoleRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateRoleOutput>
}

export class UpdateRoleRepository implements IUpdateRoleRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateRoleOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
