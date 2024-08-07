import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateItemCategoryOutput extends ICreateOutput {}
export interface ICreateItemCategoryRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateItemCategoryOutput>
}

export class CreateItemCategoryRepository implements ICreateItemCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateItemCategoryOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
