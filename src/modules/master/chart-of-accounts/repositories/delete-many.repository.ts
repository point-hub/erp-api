import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyChartOfAccountOutput {
  deleted_count: number
}
export interface IDeleteManyChartOfAccountRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyChartOfAccountOutput>
}

export class DeleteManyChartOfAccountRepository implements IDeleteManyChartOfAccountRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyChartOfAccountOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
