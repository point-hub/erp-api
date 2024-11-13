import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRejectPurchaseOrderOutput {
  matched_count: number
  modified_count: number
}
export interface IRejectPurchaseOrderRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IRejectPurchaseOrderOutput>
}

export class RejectPurchaseOrderRepository implements IRejectPurchaseOrderRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IRejectPurchaseOrderOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
