import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdatePurchaseRequestOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdatePurchaseRequestRepository {
  handle(_id: string, document: IDocument): Promise<IUpdatePurchaseRequestOutput>
}

export class UpdatePurchaseRequestRepository implements IUpdatePurchaseRequestRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdatePurchaseRequestOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
