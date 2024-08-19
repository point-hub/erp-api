import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManySupplierOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManySupplierRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManySupplierOutput>
}

export class CreateManySupplierRepository implements ICreateManySupplierRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManySupplierOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
