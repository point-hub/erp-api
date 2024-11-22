import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyCustomerGroupOutput {
  deleted_count: number
}
export interface IDeleteManyCustomerGroupRepository {
  handle(_ids: string[]): Promise<IDeleteManyCustomerGroupOutput>
}

export class DeleteManyCustomerGroupRepository implements IDeleteManyCustomerGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyCustomerGroupOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
