import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManySupplierGroupOutput {
  deleted_count: number
}
export interface IDeleteManySupplierGroupRepository {
  handle(_ids: string[]): Promise<IDeleteManySupplierGroupOutput>
}

export class DeleteManySupplierGroupRepository implements IDeleteManySupplierGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManySupplierGroupOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
