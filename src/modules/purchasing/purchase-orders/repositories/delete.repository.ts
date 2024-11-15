import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeletePurchaseOrderOutput {
  matched_count: number
  modified_count: number
}
export interface IDeletePurchaseOrderRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IDeletePurchaseOrderOutput>
}

export class DeletePurchaseOrderRepository implements IDeletePurchaseOrderRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IDeletePurchaseOrderOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
