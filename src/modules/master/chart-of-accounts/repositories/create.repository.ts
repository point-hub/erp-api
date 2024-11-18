import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateChartOfAccountOutput {
  inserted_id: string
}
export interface ICreateChartOfAccountRepository {
  handle(document: IDocument): Promise<ICreateChartOfAccountOutput>
}

export class CreateChartOfAccountRepository implements ICreateChartOfAccountRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateChartOfAccountOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
