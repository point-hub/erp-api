import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyRoleOutput extends IUpdateManyOutput {}
export interface IUpdateManyRoleRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyRoleOutput>
}

export class UpdateManyRoleRepository implements IUpdateManyRoleRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyRoleOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
