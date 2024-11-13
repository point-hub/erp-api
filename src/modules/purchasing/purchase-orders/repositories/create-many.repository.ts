import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyPurchaseOrderOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyPurchaseOrderRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyPurchaseOrderOutput>
}

export class CreateManyPurchaseOrderRepository implements ICreateManyPurchaseOrderRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyPurchaseOrderOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
