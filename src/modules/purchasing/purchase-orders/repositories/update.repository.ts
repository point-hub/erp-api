import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdatePurchaseOrderOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdatePurchaseOrderRepository {
  handle(_id: string, document: IDocument): Promise<IUpdatePurchaseOrderOutput>
}

export class UpdatePurchaseOrderRepository implements IUpdatePurchaseOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdatePurchaseOrderOutput> {
    return await this.database.collection(collectionName).update(_id, document, this.options)
  }
}
