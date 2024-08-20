import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeletePurchaseRequestOutput {
  deleted_count: number
}
export interface IDeletePurchaseRequestRepository {
  handle(_id: string, options?: unknown): Promise<IDeletePurchaseRequestOutput>
}

export class DeletePurchaseRequestRepository implements IDeletePurchaseRequestRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeletePurchaseRequestOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
