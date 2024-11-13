import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdatePurchaseOrderOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdatePurchaseOrderRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdatePurchaseOrderOutput>
}

export class UpdatePurchaseOrderRepository implements IUpdatePurchaseOrderRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdatePurchaseOrderOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
