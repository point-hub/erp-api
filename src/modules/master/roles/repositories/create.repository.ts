import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateRoleOutput extends ICreateOutput {}
export interface ICreateRoleRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateRoleOutput>
}

export class CreateRoleRepository implements ICreateRoleRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateRoleOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
