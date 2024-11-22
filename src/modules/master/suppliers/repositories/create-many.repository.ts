import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManySupplierOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManySupplierRepository {
  handle(documents: IDocument[]): Promise<ICreateManySupplierOutput>
}

export class CreateManySupplierRepository implements ICreateManySupplierRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManySupplierOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
