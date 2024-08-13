import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdatePermissionOutput extends IUpdateOutput {}
export interface IUpdatePermissionRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdatePermissionOutput>
}

export class UpdatePermissionRepository implements IUpdatePermissionRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdatePermissionOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
