import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyChartOfAccountTypeOutput extends ICreateManyOutput {}
export interface ICreateManyChartOfAccountTypeRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyChartOfAccountTypeOutput>
}

export class CreateManyChartOfAccountTypeRepository implements ICreateManyChartOfAccountTypeRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
