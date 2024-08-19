import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyItemCategoryOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyItemCategoryRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyItemCategoryOutput>
}

export class CreateManyItemCategoryRepository implements ICreateManyItemCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyItemCategoryOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
