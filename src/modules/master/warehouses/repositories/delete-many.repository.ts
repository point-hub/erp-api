import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyWarehouseOutput {
  deleted_count: number
}
export interface IDeleteManyWarehouseRepository {
  handle(_ids: string[]): Promise<IDeleteManyWarehouseOutput>
}

export class DeleteManyWarehouseRepository implements IDeleteManyWarehouseRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyWarehouseOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
