import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreatePurchaseRequestOutput {
  inserted_id: string
}
export interface ICreatePurchaseRequestRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreatePurchaseRequestOutput>
}

export class CreatePurchaseRequestRepository implements ICreatePurchaseRequestRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreatePurchaseRequestOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
