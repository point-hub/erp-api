import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManySalesQuotationOutput {
  deleted_count: number
}
export interface IDeleteManySalesQuotationRepository {
  handle(_ids: string[]): Promise<IDeleteManySalesQuotationOutput>
}

export class DeleteManySalesQuotationRepository implements IDeleteManySalesQuotationRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManySalesQuotationOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
