import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyPurchaseRequestOutput {
  deleted_count: number
}
export interface IDeleteManyPurchaseRequestRepository {
  handle(_ids: string[]): Promise<IDeleteManyPurchaseRequestOutput>
}

export class DeleteManyPurchaseRequestRepository implements IDeleteManyPurchaseRequestRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyPurchaseRequestOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
