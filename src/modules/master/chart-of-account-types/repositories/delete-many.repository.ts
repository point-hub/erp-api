import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyChartOfAccountTypeOutput {
  deleted_count: number
}
export interface IDeleteManyChartOfAccountTypeRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyChartOfAccountTypeOutput>
}

export class DeleteManyChartOfAccountTypeRepository implements IDeleteManyChartOfAccountTypeRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
