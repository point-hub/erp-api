import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyPermissionOutput extends IUpdateManyOutput {}
export interface IUpdateManyPermissionRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyPermissionOutput>
}

export class UpdateManyPermissionRepository implements IUpdateManyPermissionRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyPermissionOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
