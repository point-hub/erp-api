import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyChartOfAccountOutput {
  deleted_count: number
}
export interface IDeleteManyChartOfAccountRepository {
  handle(_ids: string[]): Promise<IDeleteManyChartOfAccountOutput>
}

export class DeleteManyChartOfAccountRepository implements IDeleteManyChartOfAccountRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyChartOfAccountOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
