import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteSupplierOutput {
  deleted_count: number
}
export interface IDeleteSupplierRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteSupplierOutput>
}

export class DeleteSupplierRepository implements IDeleteSupplierRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteSupplierOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
