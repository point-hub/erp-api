import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IApprovePurchaseRequestOutput {
  matched_count: number
  modified_count: number
}
export interface IApprovePurchaseRequestRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IApprovePurchaseRequestOutput>
}

export class ApprovePurchaseRequestRepository implements IApprovePurchaseRequestRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IApprovePurchaseRequestOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
