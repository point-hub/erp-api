import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyCustomerOutput {
  deleted_count: number
}
export interface IDeleteManyCustomerRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyCustomerOutput>
}

export class DeleteManyCustomerRepository implements IDeleteManyCustomerRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyCustomerOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
