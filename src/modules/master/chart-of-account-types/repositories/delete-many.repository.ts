import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyChartOfAccountTypeOutput extends IDeleteManyOutput {}
export interface IDeleteManyChartOfAccountTypeRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyChartOfAccountTypeOutput>
}

export class DeleteManyChartOfAccountTypeRepository implements IDeleteManyChartOfAccountTypeRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
