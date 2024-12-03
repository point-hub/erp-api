import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyPurchaseInvoiceOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyPurchaseInvoiceRepository {
  handle(documents: IDocument[]): Promise<ICreateManyPurchaseInvoiceOutput>
}

export class CreateManyPurchaseInvoiceRepository implements ICreateManyPurchaseInvoiceRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyPurchaseInvoiceOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
