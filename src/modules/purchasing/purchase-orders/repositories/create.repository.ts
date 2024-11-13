import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreatePurchaseOrderOutput {
  inserted_id: string
}
export interface ICreatePurchaseOrderRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreatePurchaseOrderOutput>
}

export class CreatePurchaseOrderRepository implements ICreatePurchaseOrderRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreatePurchaseOrderOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
