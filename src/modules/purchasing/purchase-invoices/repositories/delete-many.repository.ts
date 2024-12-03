import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyPurchaseInvoiceOutput {
  deleted_count: number
}
export interface IDeleteManyPurchaseInvoiceRepository {
  handle(_ids: string[]): Promise<IDeleteManyPurchaseInvoiceOutput>
}

export class DeleteManyPurchaseInvoiceRepository implements IDeleteManyPurchaseInvoiceRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyPurchaseInvoiceOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
