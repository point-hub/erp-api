import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyChartOfAccountOutput extends IDeleteManyOutput {}
export interface IDeleteManyChartOfAccountRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyChartOfAccountOutput>
}

export class DeleteManyChartOfAccountRepository implements IDeleteManyChartOfAccountRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyChartOfAccountOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
