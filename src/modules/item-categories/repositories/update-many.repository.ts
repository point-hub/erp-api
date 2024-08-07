import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyItemCategoryOutput extends IUpdateManyOutput {}
export interface IUpdateManyItemCategoryRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyItemCategoryOutput>
}

export class UpdateManyItemCategoryRepository implements IUpdateManyItemCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyItemCategoryOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
