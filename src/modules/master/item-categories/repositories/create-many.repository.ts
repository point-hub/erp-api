import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyItemCategoryOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyItemCategoryRepository {
  handle(documents: IDocument[]): Promise<ICreateManyItemCategoryOutput>
}

export class CreateManyItemCategoryRepository implements ICreateManyItemCategoryRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyItemCategoryOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
