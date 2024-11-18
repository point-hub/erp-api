import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyPurchaseRequestOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyPurchaseRequestRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyPurchaseRequestOutput>
}

export class UpdateManyPurchaseRequestRepository implements IUpdateManyPurchaseRequestRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyPurchaseRequestOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, this.options)
  }
}
