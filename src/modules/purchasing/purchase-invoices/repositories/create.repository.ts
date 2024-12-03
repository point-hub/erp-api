import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreatePurchaseInvoiceOutput {
  inserted_id: string
}
export interface ICreatePurchaseInvoiceRepository {
  handle(document: IDocument): Promise<ICreatePurchaseInvoiceOutput>
}

export class CreatePurchaseInvoiceRepository implements ICreatePurchaseInvoiceRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreatePurchaseInvoiceOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
