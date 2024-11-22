import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyPurchaseRequestOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyPurchaseRequestRepository {
  handle(documents: IDocument[]): Promise<ICreateManyPurchaseRequestOutput>
}

export class CreateManyPurchaseRequestRepository implements ICreateManyPurchaseRequestRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyPurchaseRequestOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
