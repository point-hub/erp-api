import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyCustomerGroupOutput {
  deleted_count: number
}
export interface IDeleteManyCustomerGroupRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyCustomerGroupOutput>
}

export class DeleteManyCustomerGroupRepository implements IDeleteManyCustomerGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyCustomerGroupOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
