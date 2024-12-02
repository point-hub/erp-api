import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyReceiveOrderOutput {
  deleted_count: number
}
export interface IDeleteManyReceiveOrderRepository {
  handle(_ids: string[]): Promise<IDeleteManyReceiveOrderOutput>
}

export class DeleteManyReceiveOrderRepository implements IDeleteManyReceiveOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyReceiveOrderOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
