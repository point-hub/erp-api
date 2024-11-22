import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateWarehouseOutput {
  inserted_id: string
}
export interface ICreateWarehouseRepository {
  handle(document: IDocument): Promise<ICreateWarehouseOutput>
}

export class CreateWarehouseRepository implements ICreateWarehouseRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateWarehouseOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
