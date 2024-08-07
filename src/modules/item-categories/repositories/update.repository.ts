import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateItemCategoryOutput extends IUpdateOutput {}
export interface IUpdateItemCategoryRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateItemCategoryOutput>
}

export class UpdateItemCategoryRepository implements IUpdateItemCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateItemCategoryOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
