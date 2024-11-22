import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeletePurchaseOrderOutput {
  matched_count: number
  modified_count: number
}
export interface IDeletePurchaseOrderRepository {
  handle(_id: string, document: IDocument): Promise<IDeletePurchaseOrderOutput>
}

export class DeletePurchaseOrderRepository implements IDeletePurchaseOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IDeletePurchaseOrderOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
