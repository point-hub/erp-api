import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyItemOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyItemRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyItemOutput>
}

export class UpdateManyItemRepository implements IUpdateManyItemRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyItemOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
