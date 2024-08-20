import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyPurchaseRequestOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyPurchaseRequestRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyPurchaseRequestOutput>
}

export class CreateManyPurchaseRequestRepository implements ICreateManyPurchaseRequestRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyPurchaseRequestOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
