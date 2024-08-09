import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyChartOfAccountOutput extends ICreateManyOutput {}
export interface ICreateManyChartOfAccountRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyChartOfAccountOutput>
}

export class CreateManyChartOfAccountRepository implements ICreateManyChartOfAccountRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyChartOfAccountOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
