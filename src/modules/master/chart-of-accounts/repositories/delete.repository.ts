import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteChartOfAccountOutput {
  deleted_count: number
}
export interface IDeleteChartOfAccountRepository {
  handle(_id: string): Promise<IDeleteChartOfAccountOutput>
}

export class DeleteChartOfAccountRepository implements IDeleteChartOfAccountRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteChartOfAccountOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
