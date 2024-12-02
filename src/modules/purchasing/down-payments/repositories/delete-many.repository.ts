import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyDownPaymentOutput {
  deleted_count: number
}
export interface IDeleteManyDownPaymentRepository {
  handle(_ids: string[]): Promise<IDeleteManyDownPaymentOutput>
}

export class DeleteManyDownPaymentRepository implements IDeleteManyDownPaymentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyDownPaymentOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
