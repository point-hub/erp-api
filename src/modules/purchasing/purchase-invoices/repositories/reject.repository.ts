import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRejectPurchaseInvoiceOutput {
  matched_count: number
  modified_count: number
}
export interface IRejectPurchaseInvoiceRepository {
  handle(_id: string, document: IDocument): Promise<IRejectPurchaseInvoiceOutput>
}

export class RejectPurchaseInvoiceRepository implements IRejectPurchaseInvoiceRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IRejectPurchaseInvoiceOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
