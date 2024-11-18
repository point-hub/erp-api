import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteChartOfAccountTypeOutput {
  deleted_count: number
}
export interface IDeleteChartOfAccountTypeRepository {
  handle(_id: string): Promise<IDeleteChartOfAccountTypeOutput>
}

export class DeleteChartOfAccountTypeRepository implements IDeleteChartOfAccountTypeRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
