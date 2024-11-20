import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManySupplierGroupOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManySupplierGroupRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManySupplierGroupOutput>
}

export class UpdateManySupplierGroupRepository implements IUpdateManySupplierGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManySupplierGroupOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
