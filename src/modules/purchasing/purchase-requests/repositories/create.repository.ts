import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreatePurchaseRequestOutput {
  inserted_id: string
}
export interface ICreatePurchaseRequestRepository {
  handle(document: IDocument): Promise<ICreatePurchaseRequestOutput>
}

export class CreatePurchaseRequestRepository implements ICreatePurchaseRequestRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreatePurchaseRequestOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
