import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyItemCategoryOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyItemCategoryRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyItemCategoryOutput>
}

export class UpdateManyItemCategoryRepository implements IUpdateManyItemCategoryRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyItemCategoryOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
