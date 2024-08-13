import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyWarehouseOutput extends IDeleteManyOutput {}
export interface IDeleteManyWarehouseRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyWarehouseOutput>
}

export class DeleteManyWarehouseRepository implements IDeleteManyWarehouseRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyWarehouseOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
