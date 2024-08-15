import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteChartOfAccountTypeOutput {
  deleted_count: number
}
export interface IDeleteChartOfAccountTypeRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteChartOfAccountTypeOutput>
}

export class DeleteChartOfAccountTypeRepository implements IDeleteChartOfAccountTypeRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
