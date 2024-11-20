import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyPurchaseOrderOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyPurchaseOrderRepository {
  handle(documents: IDocument[]): Promise<ICreateManyPurchaseOrderOutput>
}

export class CreateManyPurchaseOrderRepository implements ICreateManyPurchaseOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyPurchaseOrderOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
