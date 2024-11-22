import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyChartOfAccountTypeOutput {
  deleted_count: number
}
export interface IDeleteManyChartOfAccountTypeRepository {
  handle(_ids: string[]): Promise<IDeleteManyChartOfAccountTypeOutput>
}

export class DeleteManyChartOfAccountTypeRepository implements IDeleteManyChartOfAccountTypeRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
