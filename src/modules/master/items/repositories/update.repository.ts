import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateItemOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateItemRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateItemOutput>
}

export class UpdateItemRepository implements IUpdateItemRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateItemOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
