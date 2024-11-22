import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyPurchaseOrderOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyPurchaseOrderRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyPurchaseOrderOutput>
}

export class UpdateManyPurchaseOrderRepository implements IUpdateManyPurchaseOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyPurchaseOrderOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
