import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManySupplierOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManySupplierRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManySupplierOutput>
}

export class UpdateManySupplierRepository implements IUpdateManySupplierRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManySupplierOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, this.options)
  }
}
