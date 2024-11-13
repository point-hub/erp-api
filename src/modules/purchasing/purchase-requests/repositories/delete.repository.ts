import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeletePurchaseRequestOutput {
  matched_count: number
  modified_count: number
}
export interface IDeletePurchaseRequestRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IDeletePurchaseRequestOutput>
}

export class DeletePurchaseRequestRepository implements IDeletePurchaseRequestRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IDeletePurchaseRequestOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
