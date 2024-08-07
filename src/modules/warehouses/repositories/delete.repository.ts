import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteWarehouseOutput extends IDeleteOutput {}
export interface IDeleteWarehouseRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteWarehouseOutput>
}

export class DeleteWarehouseRepository implements IDeleteWarehouseRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteWarehouseOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
