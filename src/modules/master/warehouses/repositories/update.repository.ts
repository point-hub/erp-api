import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateWarehouseOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateWarehouseRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateWarehouseOutput>
}

export class UpdateWarehouseRepository implements IUpdateWarehouseRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateWarehouseOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
