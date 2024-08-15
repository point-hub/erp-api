import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateChartOfAccountOutput {
  inserted_id: string
}
export interface ICreateChartOfAccountRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateChartOfAccountOutput>
}

export class CreateChartOfAccountRepository implements ICreateChartOfAccountRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateChartOfAccountOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
