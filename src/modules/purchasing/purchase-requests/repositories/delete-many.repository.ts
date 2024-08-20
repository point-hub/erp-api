import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyPurchaseRequestOutput {
  deleted_count: number
}
export interface IDeleteManyPurchaseRequestRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyPurchaseRequestOutput>
}

export class DeleteManyPurchaseRequestRepository implements IDeleteManyPurchaseRequestRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyPurchaseRequestOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
