import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteSupplierGroupOutput {
  deleted_count: number
}
export interface IDeleteSupplierGroupRepository {
  handle(_id: string): Promise<IDeleteSupplierGroupOutput>
}

export class DeleteSupplierGroupRepository implements IDeleteSupplierGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteSupplierGroupOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
