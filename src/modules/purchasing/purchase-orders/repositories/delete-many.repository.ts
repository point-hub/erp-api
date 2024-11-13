import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyPurchaseOrderOutput {
  deleted_count: number
}
export interface IDeleteManyPurchaseOrderRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyPurchaseOrderOutput>
}

export class DeleteManyPurchaseOrderRepository implements IDeleteManyPurchaseOrderRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyPurchaseOrderOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
