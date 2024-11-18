import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateChartOfAccountTypeOutput {
  inserted_id: string
}
export interface ICreateChartOfAccountTypeRepository {
  handle(document: IDocument): Promise<ICreateChartOfAccountTypeOutput>
}

export class CreateChartOfAccountTypeRepository implements ICreateChartOfAccountTypeRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
