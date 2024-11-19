import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRejectPurchaseRequestOutput {
  matched_count: number
  modified_count: number
}
export interface IRejectPurchaseRequestRepository {
  handle(_id: string, document: IDocument): Promise<IRejectPurchaseRequestOutput>
}

export class RejectPurchaseRequestRepository implements IRejectPurchaseRequestRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IRejectPurchaseRequestOutput> {
    return await this.database.collection(collectionName).update(_id, document, this.options)
  }
}
