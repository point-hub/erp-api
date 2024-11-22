import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyChartOfAccountTypeOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyChartOfAccountTypeRepository {
  handle(documents: IDocument[]): Promise<ICreateManyChartOfAccountTypeOutput>
}

export class CreateManyChartOfAccountTypeRepository implements ICreateManyChartOfAccountTypeRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
