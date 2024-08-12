import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyItemOutput extends IUpdateManyOutput {}
export interface IUpdateManyItemRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyItemOutput>
}

export class UpdateManyItemRepository implements IUpdateManyItemRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyItemOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
