import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyPurchaseRequestOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyPurchaseRequestRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyPurchaseRequestOutput>
}

export class UpdateManyPurchaseRequestRepository implements IUpdateManyPurchaseRequestRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyPurchaseRequestOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
