import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateChartOfAccountTypeOutput extends ICreateOutput {}
export interface ICreateChartOfAccountTypeRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateChartOfAccountTypeOutput>
}

export class CreateChartOfAccountTypeRepository implements ICreateChartOfAccountTypeRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
