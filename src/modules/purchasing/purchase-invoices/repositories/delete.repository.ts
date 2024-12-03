import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeletePurchaseInvoiceOutput {
  matched_count: number
  modified_count: number
}
export interface IDeletePurchaseInvoiceRepository {
  handle(_id: string, document: IDocument): Promise<IDeletePurchaseInvoiceOutput>
}

export class DeletePurchaseInvoiceRepository implements IDeletePurchaseInvoiceRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IDeletePurchaseInvoiceOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
