import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateItemCategoryOutput {
  inserted_id: string
}
export interface ICreateItemCategoryRepository {
  handle(document: IDocument): Promise<ICreateItemCategoryOutput>
}

export class CreateItemCategoryRepository implements ICreateItemCategoryRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateItemCategoryOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
