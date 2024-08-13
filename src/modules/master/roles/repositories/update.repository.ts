import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateRoleOutput extends IUpdateOutput {}
export interface IUpdateRoleRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateRoleOutput>
}

export class UpdateRoleRepository implements IUpdateRoleRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateRoleOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
