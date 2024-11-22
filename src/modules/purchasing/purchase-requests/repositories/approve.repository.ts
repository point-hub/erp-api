import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IApprovePurchaseRequestOutput {
  matched_count: number
  modified_count: number
}
export interface IApprovePurchaseRequestRepository {
  handle(_id: string, document: IDocument): Promise<IApprovePurchaseRequestOutput>
}

export class ApprovePurchaseRequestRepository implements IApprovePurchaseRequestRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IApprovePurchaseRequestOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
