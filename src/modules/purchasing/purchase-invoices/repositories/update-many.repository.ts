import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyPurchaseInvoiceOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyPurchaseInvoiceRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyPurchaseInvoiceOutput>
}

export class UpdateManyPurchaseInvoiceRepository implements IUpdateManyPurchaseInvoiceRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyPurchaseInvoiceOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
