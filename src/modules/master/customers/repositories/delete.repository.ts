import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteCustomerOutput {
  deleted_count: number
}
export interface IDeleteCustomerRepository {
  handle(_id: string): Promise<IDeleteCustomerOutput>
}

export class DeleteCustomerRepository implements IDeleteCustomerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteCustomerOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
