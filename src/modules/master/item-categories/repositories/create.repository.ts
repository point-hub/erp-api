import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateItemCategoryOutput {
  inserted_id: string
}
export interface ICreateItemCategoryRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateItemCategoryOutput>
}

export class CreateItemCategoryRepository implements ICreateItemCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateItemCategoryOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
