import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyWarehouseOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyWarehouseRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyWarehouseOutput>
}

export class UpdateManyWarehouseRepository implements IUpdateManyWarehouseRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyWarehouseOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
