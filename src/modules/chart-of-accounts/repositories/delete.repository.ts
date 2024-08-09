import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteChartOfAccountOutput extends IDeleteOutput {}
export interface IDeleteChartOfAccountRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteChartOfAccountOutput>
}

export class DeleteChartOfAccountRepository implements IDeleteChartOfAccountRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteChartOfAccountOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
