import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteWarehouseOutput {
  deleted_count: number
}
export interface IDeleteWarehouseRepository {
  handle(_id: string): Promise<IDeleteWarehouseOutput>
}

export class DeleteWarehouseRepository implements IDeleteWarehouseRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteWarehouseOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
