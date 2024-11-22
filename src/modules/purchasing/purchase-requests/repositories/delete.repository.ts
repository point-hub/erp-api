import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeletePurchaseRequestOutput {
  matched_count: number
  modified_count: number
}
export interface IDeletePurchaseRequestRepository {
  handle(_id: string, document: IDocument): Promise<IDeletePurchaseRequestOutput>
}

export class DeletePurchaseRequestRepository implements IDeletePurchaseRequestRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IDeletePurchaseRequestOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
