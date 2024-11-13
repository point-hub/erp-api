import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyPurchaseOrderOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyPurchaseOrderRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyPurchaseOrderOutput>
}

export class UpdateManyPurchaseOrderRepository implements IUpdateManyPurchaseOrderRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyPurchaseOrderOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
