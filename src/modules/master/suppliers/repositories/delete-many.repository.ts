import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManySupplierOutput {
  deleted_count: number
}
export interface IDeleteManySupplierRepository {
  handle(_ids: string[]): Promise<IDeleteManySupplierOutput>
}

export class DeleteManySupplierRepository implements IDeleteManySupplierRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManySupplierOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
