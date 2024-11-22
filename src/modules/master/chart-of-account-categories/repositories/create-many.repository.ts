import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyChartOfAccountCategoryOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyChartOfAccountCategoryRepository {
  handle(documents: IDocument[]): Promise<ICreateManyChartOfAccountCategoryOutput>
}

export class CreateManyChartOfAccountCategoryRepository implements ICreateManyChartOfAccountCategoryRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyChartOfAccountCategoryOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
