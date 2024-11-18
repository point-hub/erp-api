import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateItemCategoryOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateItemCategoryRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateItemCategoryOutput>
}

export class UpdateItemCategoryRepository implements IUpdateItemCategoryRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateItemCategoryOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
