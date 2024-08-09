import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyChartOfAccountCategoryOutput extends ICreateManyOutput {}
export interface ICreateManyChartOfAccountCategoryRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyChartOfAccountCategoryOutput>
}

export class CreateManyChartOfAccountCategoryRepository implements ICreateManyChartOfAccountCategoryRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
