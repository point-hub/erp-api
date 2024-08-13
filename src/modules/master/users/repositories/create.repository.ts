import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateUserOutput extends ICreateOutput {}
export interface ICreateUserRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateUserOutput>
}

export class CreateUserRepository implements ICreateUserRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateUserOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
