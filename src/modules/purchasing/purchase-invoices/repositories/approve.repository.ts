import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IApprovePurchaseInvoiceOutput {
  matched_count: number
  modified_count: number
}
export interface IApprovePurchaseInvoiceRepository {
  handle(_id: string, document: IDocument): Promise<IApprovePurchaseInvoiceOutput>
}

export class ApprovePurchaseInvoiceRepository implements IApprovePurchaseInvoiceRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IApprovePurchaseInvoiceOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
