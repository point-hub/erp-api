import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyItemCategoryOutput extends ICreateManyOutput {}
export interface ICreateManyItemCategoryRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyItemCategoryOutput>
}

export class CreateManyItemCategoryRepository implements ICreateManyItemCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyItemCategoryOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
