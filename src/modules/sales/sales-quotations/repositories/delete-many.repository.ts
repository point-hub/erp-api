import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManySalesQuotationOutput {
  deleted_count: number
}
export interface IDeleteManySalesQuotationRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManySalesQuotationOutput>
}

export class DeleteManySalesQuotationRepository implements IDeleteManySalesQuotationRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManySalesQuotationOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
