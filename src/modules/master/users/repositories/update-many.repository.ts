import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyUserOutput extends IUpdateManyOutput {}
export interface IUpdateManyUserRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyUserOutput>
}

export class UpdateManyUserRepository implements IUpdateManyUserRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyUserOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
