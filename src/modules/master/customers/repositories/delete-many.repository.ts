import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyCustomerOutput {
  deleted_count: number
}
export interface IDeleteManyCustomerRepository {
  handle(_ids: string[]): Promise<IDeleteManyCustomerOutput>
}

export class DeleteManyCustomerRepository implements IDeleteManyCustomerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyCustomerOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
