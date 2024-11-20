import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRejectPurchaseOrderOutput {
  matched_count: number
  modified_count: number
}
export interface IRejectPurchaseOrderRepository {
  handle(_id: string, document: IDocument): Promise<IRejectPurchaseOrderOutput>
}

export class RejectPurchaseOrderRepository implements IRejectPurchaseOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IRejectPurchaseOrderOutput> {
    return await this.database.collection(collectionName).update(_id, document, this.options)
  }
}
