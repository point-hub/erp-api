import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateWarehouseOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateWarehouseRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateWarehouseOutput>
}

export class UpdateWarehouseRepository implements IUpdateWarehouseRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateWarehouseOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
