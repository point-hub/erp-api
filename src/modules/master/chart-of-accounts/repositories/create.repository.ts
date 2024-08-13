import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateChartOfAccountOutput extends ICreateOutput {}
export interface ICreateChartOfAccountRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateChartOfAccountOutput>
}

export class CreateChartOfAccountRepository implements ICreateChartOfAccountRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateChartOfAccountOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
