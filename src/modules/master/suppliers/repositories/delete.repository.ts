import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteSupplierOutput {
  deleted_count: number
}
export interface IDeleteSupplierRepository {
  handle(_id: string): Promise<IDeleteSupplierOutput>
}

export class DeleteSupplierRepository implements IDeleteSupplierRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteSupplierOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
