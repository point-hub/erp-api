import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteCustomerGroupOutput {
  deleted_count: number
}
export interface IDeleteCustomerGroupRepository {
  handle(_id: string): Promise<IDeleteCustomerGroupOutput>
}

export class DeleteCustomerGroupRepository implements IDeleteCustomerGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteCustomerGroupOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
