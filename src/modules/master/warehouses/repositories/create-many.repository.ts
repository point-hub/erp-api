import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyWarehouseOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyWarehouseRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyWarehouseOutput>
}

export class CreateManyWarehouseRepository implements ICreateManyWarehouseRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyWarehouseOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
