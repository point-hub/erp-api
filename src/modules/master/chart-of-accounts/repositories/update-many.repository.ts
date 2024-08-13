import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyChartOfAccountOutput extends IUpdateManyOutput {}
export interface IUpdateManyChartOfAccountRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyChartOfAccountOutput>
}

export class UpdateManyChartOfAccountRepository implements IUpdateManyChartOfAccountRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyChartOfAccountOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
