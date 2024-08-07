import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateUserOutput extends IUpdateOutput {}
export interface IUpdateUserRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateUserOutput>
}

export class UpdateUserRepository implements IUpdateUserRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateUserOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
