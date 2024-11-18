import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreatePermissionOutput {
  inserted_id: string
}
export interface ICreatePermissionRepository {
  handle(document: IDocument): Promise<ICreatePermissionOutput>
}

export class CreatePermissionRepository implements ICreatePermissionRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreatePermissionOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
