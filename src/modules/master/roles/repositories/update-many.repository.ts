import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyRoleOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyRoleRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyRoleOutput>
}

export class UpdateManyRoleRepository implements IUpdateManyRoleRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyRoleOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, this.options)
  }
}
