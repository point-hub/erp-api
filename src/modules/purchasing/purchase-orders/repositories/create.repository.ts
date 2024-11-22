import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreatePurchaseOrderOutput {
  inserted_id: string
}
export interface ICreatePurchaseOrderRepository {
  handle(document: IDocument): Promise<ICreatePurchaseOrderOutput>
}

export class CreatePurchaseOrderRepository implements ICreatePurchaseOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreatePurchaseOrderOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
