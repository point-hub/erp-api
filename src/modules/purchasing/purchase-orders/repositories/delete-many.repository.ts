import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyPurchaseOrderOutput {
  deleted_count: number
}
export interface IDeleteManyPurchaseOrderRepository {
  handle(_ids: string[]): Promise<IDeleteManyPurchaseOrderOutput>
}

export class DeleteManyPurchaseOrderRepository implements IDeleteManyPurchaseOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyPurchaseOrderOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
