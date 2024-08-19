import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManySupplierOutput {
  deleted_count: number
}
export interface IDeleteManySupplierRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManySupplierOutput>
}

export class DeleteManySupplierRepository implements IDeleteManySupplierRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManySupplierOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
