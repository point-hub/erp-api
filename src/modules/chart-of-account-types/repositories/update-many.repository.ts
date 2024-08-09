import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyChartOfAccountTypeOutput extends IUpdateManyOutput {}
export interface IUpdateManyChartOfAccountTypeRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyChartOfAccountTypeOutput>
}

export class UpdateManyChartOfAccountTypeRepository implements IUpdateManyChartOfAccountTypeRepository {
  constructor(public database: IDatabase) {}

  async handle(
    filter: IDocument,
    document: IDocument,
    options?: unknown,
  ): Promise<IUpdateManyChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
