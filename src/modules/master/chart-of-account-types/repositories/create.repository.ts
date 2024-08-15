import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateChartOfAccountTypeOutput {
  inserted_id: string
}
export interface ICreateChartOfAccountTypeRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateChartOfAccountTypeOutput>
}

export class CreateChartOfAccountTypeRepository implements ICreateChartOfAccountTypeRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
