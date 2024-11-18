import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyWarehouseOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyWarehouseRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyWarehouseOutput>
}

export class UpdateManyWarehouseRepository implements IUpdateManyWarehouseRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyWarehouseOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, this.options)
  }
}
