import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeletePurchaseOrderOutput {
  deleted_count: number
}
export interface IDeletePurchaseOrderRepository {
  handle(_id: string, options?: unknown): Promise<IDeletePurchaseOrderOutput>
}

export class DeletePurchaseOrderRepository implements IDeletePurchaseOrderRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeletePurchaseOrderOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
