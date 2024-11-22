import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateSupplierOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateSupplierRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateSupplierOutput>
}

export class UpdateSupplierRepository implements IUpdateSupplierRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateSupplierOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
