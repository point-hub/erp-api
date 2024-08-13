import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteChartOfAccountTypeOutput extends IDeleteOutput {}
export interface IDeleteChartOfAccountTypeRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteChartOfAccountTypeOutput>
}

export class DeleteChartOfAccountTypeRepository implements IDeleteChartOfAccountTypeRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteChartOfAccountTypeOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
