import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateWarehouseOutput {
  inserted_id: string
}
export interface ICreateWarehouseRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateWarehouseOutput>
}

export class CreateWarehouseRepository implements ICreateWarehouseRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateWarehouseOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
