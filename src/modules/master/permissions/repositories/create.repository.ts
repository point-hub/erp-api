import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreatePermissionOutput {
  inserted_id: string
}
export interface ICreatePermissionRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreatePermissionOutput>
}

export class CreatePermissionRepository implements ICreatePermissionRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreatePermissionOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
