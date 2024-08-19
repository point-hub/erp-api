import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManySupplierGroupOutput {
  deleted_count: number
}
export interface IDeleteManySupplierGroupRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManySupplierGroupOutput>
}

export class DeleteManySupplierGroupRepository implements IDeleteManySupplierGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManySupplierGroupOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
