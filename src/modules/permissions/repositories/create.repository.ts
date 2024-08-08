import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreatePermissionOutput extends ICreateOutput {}
export interface ICreatePermissionRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreatePermissionOutput>
}

export class CreatePermissionRepository implements ICreatePermissionRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreatePermissionOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
