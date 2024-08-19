import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManySupplierGroupOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManySupplierGroupRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManySupplierGroupOutput>
}

export class CreateManySupplierGroupRepository implements ICreateManySupplierGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManySupplierGroupOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
